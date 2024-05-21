using boldbi.web.api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;
using System.Security.Cryptography;

namespace boldbi.web.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly EmbedDetails _boldbiIProperties;
        private string _embedSecret;

        public DashboardController(EmbedDetails boldbiProperties)
        {
            _boldbiIProperties = boldbiProperties;     
        }

        [AllowAnonymous]
        [HttpGet("getboldbisettings")]
        public EmbedConfig GetBoldBIProperties()
        {
            var filterType = Request.Headers["filterType"];
            EmbedConfig embedDetails = null;

            switch (filterType)
            {
                case "datasource":
                    {
                        embedDetails = GetFilteredProperties(_boldbiIProperties.Datasource);
                        break;
                    }
                case "isolation":
                    {
                        var tenant = Request.Headers["tenant"];
                        var dashboard = Request.Headers["isolationDashboard"];
                        embedDetails = GetIsolationDashboard(tenant, dashboard);
                        break;
                    }
                case "dynamic":
                    {
                        var key = Request.Headers["key"];
                        if (key == "identity1")
                        {
                            embedDetails = GetFilteredProperties(_boldbiIProperties.DynamicConnectionStringIdentity1);
                        }
                        else
                        {
                            embedDetails = GetFilteredProperties(_boldbiIProperties.DynamicConnectionStringIdentity2);
                        }
                        break;
                    }
            }
            return embedDetails ?? new EmbedConfig();
        }

        private EmbedConfig GetFilteredProperties(EmbedConfig source)
        {
            return new EmbedConfig
            {
                DashboardId = source.DashboardId,
                ServerUrl = source.ServerUrl,
                Environment = source.Environment,
                SiteIdentifier = source.SiteIdentifier
            };
        }

        private EmbedConfig GetIsolationDashboard(string tenant, string dashboard)
        {
            EmbedConfig dashboardConfig = null;

            switch (tenant)
            {
                case "tenant1":
                    dashboardConfig = dashboard == "dashboard1" ? _boldbiIProperties.Tenant1Dashboard1 : _boldbiIProperties.Tenant1Dashboard2;
                    break;
                case "tenant2":
                    dashboardConfig = dashboard == "dashboard1" ? _boldbiIProperties.Tenant2Dashboard1 : _boldbiIProperties.Tenant2Dashboard2;
                    break;
            }

            return dashboardConfig != null ? GetFilteredProperties(dashboardConfig) : null;
        }

        [AllowAnonymous]
        [HttpPost("authorize")]
        public string AuthorizeDashboard([FromBody] object embedQuerString)
            {
            var embedClass = JsonConvert.DeserializeObject<EmbedClass>(embedQuerString.ToString());
            var embedQuery = embedClass.embedQuerString;
            string filterType = Request.Headers["filterType"];
            if( filterType == "datasource")
            {
                //getting the datasource filter values from the header and appended it to the embedQuery
                string regions = Request.Headers["regions"];
                string category = Request.Headers["category"];
                embedQuery += "&embed_user_email=" + _boldbiIProperties.Datasource.UserEmail + "&embed_datasource_filter=[{&&Region=" + regions + "&Category=" + category + "}]";
                _embedSecret = _boldbiIProperties.Datasource.EmbedSecret;

            }
            else if (filterType == "isolation")
            {
                //Isolation filter is applied on the site level
                var tenant = Request.Headers["tenant"];
                if (tenant == "tenant1")
                {
                    embedQuery += "&embed_user_email=" + _boldbiIProperties.Tenant1Dashboard1.UserEmail;
                    _embedSecret = _boldbiIProperties.Tenant1Dashboard1.EmbedSecret;
                }
                else
                {
                    embedQuery += "&embed_user_email=" + _boldbiIProperties.Tenant2Dashboard1.UserEmail;
                    _embedSecret = _boldbiIProperties.Tenant2Dashboard1.EmbedSecret;

                }   
            }
            else if (filterType == "dynamic")
            {
                _embedSecret = _boldbiIProperties.DynamicConnectionStringIdentity1.EmbedSecret;
                var key = Request.Headers["key"];
                if (key == "identity1")
                {
                    embedQuery += "&embed_user_email=" + _boldbiIProperties.DynamicConnectionStringIdentity1.UserEmail;
                }
                else
                {
                    embedQuery += "&embed_user_email=" + _boldbiIProperties.DynamicConnectionStringIdentity2.UserEmail;
                }
            }

            //To set embed_server_timestamp to overcome the EmbedCodeValidation failing while different timezone using at client application.
            double timeStamp = (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
            embedQuery += "&embed_server_timestamp=" + timeStamp;
            var embedDetailsUrl = "/embed/authorize?" + embedQuery + "&embed_signature=" + GetSignatureUrl(embedQuery);

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(embedClass.dashboardServerApiUrl);
                client.DefaultRequestHeaders.Accept.Clear();
                var result = client.GetAsync(embedClass.dashboardServerApiUrl + embedDetailsUrl).Result;
                string resultContent = result.Content.ReadAsStringAsync().Result;
                return resultContent;
            }

        }

        public string GetSignatureUrl(string queryString)
        {
            if (queryString != null)
            {
                var encoding = new System.Text.UTF8Encoding();
                var keyBytes = encoding.GetBytes(_embedSecret);
                var messageBytes = encoding.GetBytes(queryString);
                using (var hmacsha1 = new HMACSHA256(keyBytes))
                {
                    var hashMessage = hmacsha1.ComputeHash(messageBytes);
                    return Convert.ToBase64String(hashMessage);
                }
            }
            return string.Empty;
        }
    }
}

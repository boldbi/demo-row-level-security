﻿using Newtonsoft.Json;
using System.Runtime.Serialization;

namespace boldbi.web.api.Model
{
    [DataContract]
    public class EmbedClass
    {
        [DataMember]
        public string embedQuerString { get; set; }
        [DataMember]
        public string dashboardServerApiUrl { get; set; }
    }

    public class TokenObject
    {
        public string Message { get; set; }

        public string Status { get; set; }

        public string Token { get; set; }
    }

    public class Token
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }

        [JsonProperty("token_type")]
        public string TokenType { get; set; }

        [JsonProperty("expires_in")]
        public string ExpiresIn { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        public string LoginResult { get; set; }

        public string LoginStatusInfo { get; set; }

        [JsonProperty(".issued")]
        public string Issued { get; set; }

        [JsonProperty(".expires")]
        public string Expires { get; set; }
    }
    public class EmbedDetails
    {
        public EmbedConfig Datasource { get; set; }
        public EmbedConfig Tenant1Dashboard1 { get; set; }
        public EmbedConfig Tenant1Dashboard2 { get; set; }
        public EmbedConfig Tenant2Dashboard1 { get; set; }
        public EmbedConfig Tenant2Dashboard2 { get; set; }
        public EmbedConfig DynamicConnectionStringIdentity1 { get; set; }
        public EmbedConfig DynamicConnectionStringIdentity2 { get; set; }
        public EmbedConfig DynamicConnectionStringCustomAttributeUser1 { get; set; }
        public EmbedConfig DynamicConnectionStringCustomAttributeUser2 { get; set; }
        public EmbedConfig WebDatasource { get; set; }
        public EmbedConfig UserFilterUser1 { get; set; }
        public EmbedConfig UserFilterUser2 { get; set; }
        public EmbedConfig UserFilterUser3 { get; set; }
    }

    public class EmbedConfig
    {
        public string DashboardId { get; set; }
        public string ServerUrl { get; set; }
        public string UserEmail { get; set; }
        public string EmbedSecret { get; set; }
        public string EmbedType { get; set; }
        public string Environment { get; set; }
        public string ExpirationTime { get; set; }
        public string SiteIdentifier { get; set; }
    }
}

/**
 * server配置
 * 
 */

const utils = require("mk-service-utils")
const dubbox = require("mk-service-dubbox")
const auth = require("mk-service-auth")

const config = ({ services }) => {
    Object.assign(server.services, services)
    configServices(server)
    return server
}

const server = {
    host: "0.0.0.0",
    port: "${webport||8000}",
    website: __dirname + "/html/",
    apiRootUrl: "/v1",
    interceptors: [],
    services: {
        // referrenced service
        utils,
        dubbox,
        auth,
    },
    configs: {
        // serviceName: {}
        auth: {
            secret: new Buffer([-82, -69, 98, -103, -21, 28, -94, 111, -27, -94, 8, -89, -2, -38, 36, 122, 127, -54]),
            tokenKeys: ["userId", "orgId", "versionId", "appId"],
            errorObj: { code: "40100", message: "未登录" },
            exclude: [
                "/*",
            ],
        },
        dubbox: {
            application: {
                name: "eap-webserver"
            },
            discoveryInterfaces: ["com.mk.eap.portal.itf.IPortalDiscoveryService", "${discovery}"],
            register: "127.0.0.1:2181",
            dubboVer: "2.8.4a",
            group: "",
            timeout: 6000,
        },
    },
}

function configServices(server) {
    var { services, configs } = server;
    Object.keys(services).filter(k => !!services[k].config).forEach(k => {
        let curCfg = Object.assign({ server, services }, configs["*"], configs[k]);
        if (services.utils && services.utils.api.env) curCfg = services.utils.api.env(curCfg,2);
        services[k].config(curCfg);
    })
}

module.exports = config

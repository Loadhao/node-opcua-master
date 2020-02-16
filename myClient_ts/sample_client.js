"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_opcua_1 = require("node-opcua");
var connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1
};
var options = {
    certificateFile: "C:\\Users\\17802\\Desktop\\opc-ua开发\\demo\\myserver\\key\\client_cert_1024.pem",
    privateKeyFile: "C:\\Users\\17802\\Desktop\\opc-ua开发\\demo\\myserver\\key\\client_key_1024.pem",
    applicationName: "MyClient",
    connectionStrategy: connectionStrategy,
    securityMode: node_opcua_1.MessageSecurityMode.None,
    securityPolicy: node_opcua_1.SecurityPolicy.None,
    endpoint_must_exist: false
};
var client = node_opcua_1.OPCUAClient.create(options);
var endpointUrl = "opc.tcp://LoadHao.lan:4335/UA/MyLittleServer";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        // @ts-ignore
        function timeout(ms) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
                });
            });
        }
        var session, browseResult, _i, _a, reference, dataValue2, maxAge, nodeToRead, dataValue, subscription_1, itemToMonitor, parameters, monitoredItem, browsePath, result, productNameNodeId, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 11, , 12]);
                    // step 1 : connect to
                    return [4 /*yield*/, client.connect(endpointUrl)];
                case 1:
                    // step 1 : connect to
                    _b.sent();
                    console.log("connected !");
                    return [4 /*yield*/, client.createSession()];
                case 2:
                    session = _b.sent();
                    console.log("session created !");
                    return [4 /*yield*/, session.browse("RootFolder")];
                case 3:
                    browseResult = _b.sent();
                    console.log("references of RootFolder :");
                    for (_i = 0, _a = browseResult.references; _i < _a.length; _i++) {
                        reference = _a[_i];
                        console.log("   -> ", reference.browseName.toString());
                    }
                    return [4 /*yield*/, session.readVariableValue("ns=1;s=variable_1")];
                case 4:
                    dataValue2 = _b.sent();
                    console.log(" value = ", dataValue2.toString());
                    maxAge = 0;
                    nodeToRead = {
                        nodeId: "ns=1;s=variable_1",
                        attributeId: node_opcua_1.AttributeIds.Value
                    };
                    return [4 /*yield*/, session.read(nodeToRead, maxAge)];
                case 5:
                    dataValue = _b.sent();
                    console.log(" read a variable with read: value= ", dataValue.toString());
                    subscription_1 = node_opcua_1.ClientSubscription.create(session, {
                        requestedPublishingInterval: 1000,
                        requestedLifetimeCount: 100,
                        requestedMaxKeepAliveCount: 10,
                        maxNotificationsPerPublish: 100,
                        publishingEnabled: true,
                        priority: 10
                    });
                    subscription_1
                        .on("started", function () {
                        console.log("subscription started for 2 seconds - subscriptionId=", subscription_1.subscriptionId);
                    })
                        .on("keepalive", function () {
                        console.log("keepalive");
                    })
                        .on("terminated", function () {
                        console.log("terminated");
                    });
                    itemToMonitor = {
                        nodeId: "ns=1;s=variable_1",
                        attributeId: node_opcua_1.AttributeIds.Value
                    };
                    parameters = {
                        samplingInterval: 100,
                        discardOldest: true,
                        queueSize: 10
                    };
                    monitoredItem = node_opcua_1.ClientMonitoredItem.create(subscription_1, itemToMonitor, parameters, node_opcua_1.TimestampsToReturn.Both);
                    monitoredItem.on("changed", function (dataValue) {
                        console.log(" value has changed : ", dataValue.value.toString());
                    });
                    return [4 /*yield*/, timeout(10000)];
                case 6:
                    _b.sent();
                    console.log("now terminating subscription");
                    return [4 /*yield*/, subscription_1.terminate()];
                case 7:
                    _b.sent();
                    browsePath = node_opcua_1.makeBrowsePath("RootFolder", "/Objects/Server.ServerStatus.BuildInfo.ProductName");
                    return [4 /*yield*/, session.translateBrowsePath(browsePath)];
                case 8:
                    result = _b.sent();
                    productNameNodeId = result.targets[0].targetId;
                    console.log(" Product Name nodeId = ", productNameNodeId.toString());
                    // close session
                    return [4 /*yield*/, session.close()];
                case 9:
                    // close session
                    _b.sent();
                    // disconnecting
                    return [4 /*yield*/, client.disconnect()];
                case 10:
                    // disconnecting
                    _b.sent();
                    console.log("done !");
                    return [3 /*break*/, 12];
                case 11:
                    err_1 = _b.sent();
                    console.log("An error has occured : ", err_1);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=sample_client.js.map
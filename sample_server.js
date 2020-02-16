const opcua = require("node-opcua");

const server = new opcua.OPCUAServer({
    port: 4335, // the port of the listening socket of the server
    resourcePath: "/UA/MyLittleServer", // this path will be added to the endpoint resource name
    certificateFile: "C:\\Users\\17802\\Desktop\\opc-ua开发\\demo\\myserver\\key\\server_cert_1024.pem",
    privateKeyFile: "C:\\Users\\17802\\Desktop\\opc-ua开发\\demo\\myserver\\key\\server_key_1024.pem",
    unsafePerms: true,
    allowAnonymous: true, // 允许匿名访问
    buildInfo: {
        productName: "MySampleServer1",
        buildNumber: "7658",
        buildDate: new Date(2014, 5, 2)
    }
});

server.initialize(post_initialize);

function post_initialize() {
    console.log("initialized");
    construct_my_address_space(server, function () {
        server.start(function () {
            console.log("Server is now listening ... ( press CTRL+C to stop)");
            console.log("port ", server.endpoints[0].port);
            const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
            console.log(" the primary server endpoint url is ", endpointUrl);
        });
    });

}

function construct_my_address_space(server, callback) {

    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();

    // declare a new object
    const device = namespace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
        browseName: "MyDevice"
    });

    // add a variable named MyVariable1 to the newly created folder "MyDevice"
    let variable1 = 1;

    // emulate variable1 changing every 500 ms
    setInterval(function () {
        variable1 += 1;
    }, 500);

    namespace.addVariable({
        componentOf: device,
        nodeId: "ns=1;s=variable_1",
        browseName: "MyVariable1",
        dataType: "Double",
        value: {
            get: function () {
                return new opcua.Variant({dataType: opcua.DataType.Double, value: variable1});
            }
        }
    });
    callback();
}

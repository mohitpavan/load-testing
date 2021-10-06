"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getResultFolder = exports.getTestRunId = exports.sleep = exports.getStatisticsFile = exports.printClientMetrics = exports.getResultsFile = exports.printTestDuration = void 0;
const fs = __importStar(require("fs"));
var path = require('path');
var AdmZip = require("adm-zip");
const { v4: uuidv4 } = require('uuid');
function printTestDuration(vusers, startTime) {
    return __awaiter(this, void 0, void 0, function* () {
        let endTime = new Date();
        console.log("TestRun completed\n");
        console.log("-------------------Summary ---------------");
        console.log("TestRun start time: " + startTime);
        console.log("TestRun end time: " + endTime);
        console.log("Virtual Users: " + vusers);
        console.log("TestStatus: DONE \n");
        return;
    });
}
exports.printTestDuration = printTestDuration;
function getResultsFile(response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filePath = path.join('loadTest', 'results.zip');
            const file = fs.createWriteStream(filePath);
            return new Promise((resolve, reject) => {
                file.on("error", (err) => reject(err));
                const stream = response.message.pipe(file);
                stream.on("close", () => {
                    try {
                        resolve(filePath);
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            });
        }
        catch (err) {
            err.message = "Error in fetching the results of the testRun";
            throw err;
        }
    });
}
exports.getResultsFile = getResultsFile;
function printClientMetrics(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var statisticsobj = JSON.stringify(obj);
        console.log("------------------Client-side metrics------------\n");
        for (var key in obj) {
            if (key != "Total")
                printMetrics(obj[key]);
        }
    });
}
exports.printClientMetrics = printClientMetrics;
function getStatisticsFile(obj) {
    var obj;
    return __awaiter(this, void 0, void 0, function* () {
        let target = path.join('dropResults', "reports");
        try {
            var filepath = path.join('dropResults', 'results.zip');
            var zip = new AdmZip(filepath);
            zip.extractAllTo(target);
            let stats = path.join(target, "statistics.json");
            let json = fs.readFileSync(stats, 'utf8');
            obj = JSON.parse(json);
            console.log("------------------Client-side metrics------------\n");
            for (var key in obj) {
                if (key != "Total")
                    printMetrics(obj[key]);
            }
            deleteFile(target);
        }
        catch (err) {
            err.message = "Error in fetching the client-side metrics of the testRun";
            throw err;
        }
    });
}
exports.getStatisticsFile = getStatisticsFile;
function printMetrics(data) {
    console.log(data.transaction);
    console.log("response time \t\t : avg=" + getAbsVal(data.meanResTime) + "ms min=" + getAbsVal(data.minResTime) + "ms med=" + getAbsVal(data.medianResTime) + "ms max=" + getAbsVal(data.maxResTime) + "ms p(90)=" + getAbsVal(data.pct1ResTime) + "ms p(95)=" + getAbsVal(data.pct2ResTime) + "ms p(99)=" + getAbsVal(data.pct3ResTime) + "ms");
    console.log("requests per sec \t : avg=" + getAbsVal(data.throughput));
    console.log("total requests \t\t : " + data.sampleCount);
    console.log("total errors \t\t : " + data.errorCount);
    console.log("total error rate \t : " + data.errorPct);
}
function getAbsVal(data) {
    data = data.toString();
    var index = data.indexOf(".");
    if (index != -1)
        data = data.substr(0, index);
    return data;
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
function getTestRunId() {
    return uuidv4();
}
exports.getTestRunId = getTestRunId;
function getResultFolder(testArtifacts) {
    if (testArtifacts == null || testArtifacts.outputArtifacts == null)
        return null;
    var outputurl = testArtifacts.outputArtifacts;
    return (outputurl.resultUrl != null) ? outputurl.resultUrl.url : null;
}
exports.getResultFolder = getResultFolder;
function deleteFile(foldername) {
    if (fs.existsSync(foldername)) {
        fs.readdirSync(foldername).forEach((file, index) => {
            const curPath = path.join(foldername, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFile(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(foldername);
    }
}
exports.deleteFile = deleteFile;
import fs from "fs";
import path from "path";

// This will literally write to json, this will be replaced by Mongodb

function writeObjectToJson(jsonPath, object) {
  const fullPath = path.join(__dirname, jsonPath);
  const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  data.push(object);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
}

export default writeObjectToJson;

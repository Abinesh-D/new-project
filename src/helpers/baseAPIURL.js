import appMode from "./appMode";

// 1 - localhost, 2 - development, 3 - beta
let baseAPIURL = appMode === "1" ? "http://localhost:5000/api/patent"  : "http://localhost:3000/api/patent"



 

// appMode === "2" ? "https://auditvista.com/kalakriya-dev-api" 
// appMode === "3" && "https://auditvista.com/kalakriya-live-api/"

export default baseAPIURL
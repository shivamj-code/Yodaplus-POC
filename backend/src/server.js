require("dotenv").config();

const app = require("./app");

// Import database connection
require("./config/db");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`====================================`);
    console.log(`Server running on port ${PORT}`);
    console.log(`====================================`);
});
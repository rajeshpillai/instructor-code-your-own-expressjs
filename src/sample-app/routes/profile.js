// Router module
const rocket = require('../../lib/rocket');
const router = rocket.Router();

router.get("/", (req, res) => {
    res.send("/Show all profiles");
});

router.get("/:name", (req, res) => {
    res.send(`Showing profile of ${req.params.name}`);
});

module.exports = router;


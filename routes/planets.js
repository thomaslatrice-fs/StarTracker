const router = require("express").Router();
const controller = require("../controllers/planets.controller");
const upload = require("../middleware/upload");

router.get("/", controller.index);
router.get("/new", controller.newForm);
router.get("/:id", controller.show);
router.get("/:id/edit", controller.editForm);
router.post("/", upload.single("image"), controller.create);
router.put("/:id", upload.single("image"), controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;

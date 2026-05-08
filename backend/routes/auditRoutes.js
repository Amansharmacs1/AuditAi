const express = require("express");

const router = express.Router();

const Audit = require("../models/Audit");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);


// =============================
// 🟢 POST - SAVE AUDIT
// =============================

router.post("/", async (req, res) => {

  try {

    const { tools } = req.body;

    // enrich tools
    const enrichedTools =
      tools.map((t) => ({

        ...t,

        totalCost:
          t.cost * t.seats,

      }));

    // create audit
    const newAudit =
      new Audit({

        userEmail:
          req.user.email,

        tools:
          enrichedTools,

      });

    const saved =
      await newAudit.save();

    res.status(201).json({

      success: true,

      message:
        "Audit saved successfully 🚀",

      data: saved,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        "Error saving data",

      error:
        error.message,

    });
  }
});


// =============================
// 🟢 GET ALL AUDITS
// =============================

router.get("/", async (req, res) => {

  try {

    const data =
      await Audit.find({
        userEmail:
          req.user.email,
      });

    const formatted =
      data.map((item) => ({

        id: item._id,

        userEmail:
          item.userEmail,

        tools:
          item.tools,

        totalSessionCost:
          item.tools.reduce(

            (sum, t) =>
              sum + t.totalCost,

            0
          ),

        createdAt:
          item.createdAt,

      }));

    res.json({

      success: true,

      count:
        formatted.length,

      data: formatted,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        "Error fetching data",

      error:
        error.message,

    });
  }
});


// =============================
// 🟢 GET LATEST AUDIT
// =============================

router.get(
  "/latest",

  async (req, res) => {

    try {

      const latest =
        await Audit.findOne({
          userEmail:
            req.user.email,
        })
          .sort({
            _id: -1,
          });

      res.json({

        success: true,

        data: latest,

      });

    } catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message,

      });
    }
  }
);


// =============================
// 🟢 GET USER HISTORY
// =============================

router.get(
  "/history/:email",

  async (req, res) => {

    try {

      const { email } =
        req.params;

      if (email !== req.user.email) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden: cannot access another user's history",
        });
      }

      const audits =
        await Audit.find({

          userEmail:
            email,

        }).sort({
          createdAt: -1,
        });

      res.json({

        success: true,

        data: audits,

      });

    } catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message,

      });
    }
  }
);


// =============================
// 🟢 DELETE ONE AUDIT
// =============================

router.delete(
  "/:id",

  async (req, res) => {

    try {
      const { id } = req.params;

      const deletedAudit = await Audit.findOneAndDelete({
        _id: id,
        userEmail: req.user.email,
      });

      if (!deletedAudit) {
        return res.status(404).json({
          success: false,
          message: "Audit not found",
        });
      }

      return res.json({
        success: true,
        message: "Audit deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error deleting audit",
        error: error.message,
      });
    }
  }
);


// =============================
// 🟢 DELETE ALL
// =============================

router.delete(
  "/",

  async (req, res) => {

    try {

      await Audit.deleteMany({
        userEmail:
          req.user.email,
      });

      res.json({

        success: true,

        message:
          "All data deleted 🧹",

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          "Error deleting data",

        error:
          error.message,

      });
    }
  }
);


module.exports = router;
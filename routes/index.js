const express = require('express')
const router = express.Router()

// маршруты api
router.use("/territory", require("./tmusl"));
router.use("/federal", require("./federal"))
router.get("/health", async (req, res) =>
  res.status(200).json({ success: true, msg: "Сервис работает стабильно" })
);

// 404
router.use('*', async (req, res) => {
  res.status(404).json({ success: false, msg: 'Маршрут не найден' })
})

module.exports = router

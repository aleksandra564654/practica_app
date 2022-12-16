const express = require('express')
const router = express.Router()
const db = require('../config/db')

// поиск сопоставления
router.get("/l_nom_musl", async (req, res) => {
    try {
      const { idtmusl = null } = req.query;
      // проверка наличия параметров и если нет то ответ 400
      if (!idtmusl)
        return res
          .status(400)
          .json({ status: "error", msg: "Укажите параметры для поиска" });

      // формируем запрос в базу
      const sql = `select t.idl_nom_musl, t.bgdate, t.bgreason, t.cldate, 
        t.clreason, t.mddate, t.mdreason, t.crdate, t.idnsi_nom_musl, t.idtmusl
        from public.l_nom_musl t 
        where t.idtmusl = $1`;
      const data = (await db.query(sql, [idtmusl])).rows;

      // проверим есть ли данные
      if (!data.length)
        return res
          .status(404)
          .json({
            status: "error",
            msg: "По вашим параметрам записей не найдено",
          });

      // ответ сервиса
      return res.status(200).json({
        status: "success",
        msg: "Федеральный справочник услуг",
        total: data.length,
        data,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", msg: "Ошибка сервера", error: error.message });
    }
  });
  



// поиск услуги в федеральном справочнике
router.get("/nsi_nom_musl", async (req, res) => {
    try {
      const { idnsi_nom_musl = null } = req.query;
      // проверка наличия параметров и если нет то ответ 400
      if (!idnsi_nom_musl)
        return res
          .status(400)
          .json({ status: "error", msg: "Укажите параметры для поиска" });

      // формируем запрос в базу
      const sql = `  select t.idnsi_nom_musl, t.nsi_nom_musl, t.bgdate, t.bgreason, t.cldate, t.clreason, 
        t.mddate, t.mdreason, t.crdate, t.nsi_id, t.s_code, t.name, t.rel, t.dateout, t.start_version, t.end_version
        from public.nsi_nom_musl t 
        where t.idnsi_nom_musl = $1`;
      const data = (await db.query(sql, [idnsi_nom_musl])).rows;

      // проверим есть ли данные
      if (!data.length)
        return res
          .status(404)
          .json({
            status: "error",
            msg: "По вашим параметрам записей не найдено",
          });

      // ответ сервиса
      return res.status(200).json({
        status: "success",
        msg: "Федеральный справочник услуг",
        total: data.length,
        data,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", msg: "Ошибка сервера", error: error.message });
    }
  });

module.exports = router

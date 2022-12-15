const express = require('express')
const router = express.Router()
const db = require('../config/db')

// парсер параметров
const parseParams = (params) => {
    let where = [];
    let values = [];
    let counter = 1;
    Object.keys(params).forEach(item => {
        const value = params[item]
        if (value) {
            where.push(`${item} = $${counter}`);
            values.push(value);
            counter++;
        }
    })
    return { where: where.join(' and ' ), values }
}

// поиск по справонику tmusl
router.get("/tmusl", async (req, res) => {
  try {
    const params = {}; // объект параметров поиска
    const {
      s_kod = null,
      bgdate = null,
      idtmusl = null,
    } = req.query;

    // формирование объекта параметров
    if (s_kod) params.s_kod = s_kod;
    if (bgdate) params.bgdate = bgdate;
    if (idtmusl) params.idtmusl = idtmusl;
    // проверка наличия параметров и если нет то ответ 400
    if (!Object.keys(params).length) return res.status(400).json({status: 'error', msg: 'Укажите параметры для поиска'})

    // формируем запрос в базу
    const { where, values } = parseParams(params);
    const sql = `select t.idtmusl, t.tmusl, t.bgdate, t.bgreason, t.cldate, t.clreason, t.mddate, 
        t.mdreason, t.crdate, t.razdel, t.vkt, t.utype, t.uclass, t.uvid, t.usubvid, t.fl_ter, 
        t.fl_ddisp, t.idmedusl, t.s_kod, t.r_numb, t.old_code, t.fullname
        from public.tmusl t 
        where ${where}`;    
    const data = (await db.query(sql, values)).rows;

    // проверим есть ли данные
    if (!data.length) return res.status(404).json({status:'error', msg:'По вашим параметрам записей не найдено'})

    // ответ сервиса
    return res.status(200).json({
      status: "success",
      msg: "Региональный справочник услуг",
      total: data.length,
      data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", msg: "Ошибка сервера", error: error.message });
  }
});

// поиск по справочнику tmusl0
router.get('/tmusl0', async(req,res) => {
    try {
      const params = {};

      const { idparent = null, crdate = null, idtmusl = null } = req.query;

      let sql = `select t.id_tmusl0, t.idparent, t.path, t.crdate, t.haschild, t.childindex, t.refno, t.idtmusl
      from public._tmusl0 t where `;
      // формируем параметры
      if (!idparent) sql += "t.idparent is null";
      else params.idparent = idparent;
      if (crdate) params.crdate = crdate;
      if (idtmusl && idparent) params.idtmusl = idtmusl;

      // проверка наличия параметров и если они есть то выполняем запрос
      let data;
      if (Object.keys(params).length) {
        const { where, values } = parseParams(params);
        sql += ` ${where}`;
        data = (await db.query(sql, values)).rows;
      } else data = (await db.query(sql)).rows; // просто запрос в базу

      // проверим есть ли данные
      if (!data.length)
        return res.status(404).json({
          status: "error",
          msg: "По вашим параметрам записей не найдено",
        });

      // ответ сервиса
      return res.status(200).json({
        status: "success",
        msg: "Оглавление территориального справочника услуг",
        total: data.length,
        data,
      });
    } catch (error) {
        return res
        .status(500)
        .json({ status: "error", msg: "Ошибка сервера", error: error.message });
    }
})



module.exports = router

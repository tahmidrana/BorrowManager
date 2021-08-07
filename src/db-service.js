import {enablePromise, openDatabase} from 'react-native-sqlite-storage';

enablePromise(true);

const database_name = 'borrowmanager_db_2021.db';
const database_version = '1.1';
const database_displayname = 'SQLite React Offline Database';
const database_size = 200000;

const tbl_contacts = 'tbl_contacts';
const tbl_records = 'tbl_records';
const tbl_payments = 'tbl_payments';
const tbl_profile_settings = 'tbl_profile_settings';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const payment_types = ["Cash", "Cheque", "Credit card", "debit card", "Other"];

export const getDBConnection = async () => {
  return openDatabase({name: database_name, location: 'default'});
};

export const createTables = async db => {
  const contacts_table_query = `CREATE TABLE IF NOT EXISTS ${tbl_contacts} (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name VARCHAR(100), 
    phone VARCHAR(30) DEFAULT NULL, 
    notes VARCHAR(150) DEFAULT NULL);`;

  const records_table_query = `CREATE TABLE IF NOT EXISTS ${tbl_records} (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    amount DECIMAL(10,2) NOT NULL,
    contact_id INTEGER, 
    record_type INTEGER DEFAULT 1,
    payment_type INTEGER DEFAULT NULL,
    is_closed INT(1) DEFAULT 0, 
    short_note TEXT DEFAULT NULL,
    due_date DATETIME DEFAULT NULL,
    entry_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reminder_date DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`;

  const payments_table_query = `CREATE TABLE IF NOT EXISTS ${tbl_payments} (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    amount DECIMAL(10,2) NOT NULL,
    record_id INTEGER, 
    record_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`;

  await db.executeSql(contacts_table_query);
  await db.executeSql(records_table_query);
  await db.executeSql(payments_table_query);
};

export const getContacts = async db => {
  try {
    let contacts = [];
    const results = await db.executeSql(
      `SELECT * from ${tbl_contacts} order by id desc;`,
    );

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        let item = result.rows.item(index);
        //let dt = new Date(item.created_at);
        //let mon = months[dt.getMonth()];
        /* let formatted_dt = `${dt.getDate()} ${mon}, ${dt.getFullYear()}`;
        item.formatted_dt = formatted_dt; */
        contacts.push(item);
      }
    });

    return contacts;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get data !!!');
  }
};

export const saveNewContact = async (db, data) => {
  // const insertQuery = `INSERT INTO ${table_checklist}(title, created_at) values (?, ?)`;
  const insertQuery = `INSERT INTO ${tbl_contacts}(name, phone, notes) 
  values('${data.name}', '${data.phone}', '${data.notes}')`;

  // return db.executeSql(insertQuery, [checklist.title, checklist.created_at]);
  return db.executeSql(insertQuery);
};

export const createNewRecord = async (db, data) => {
  if (data.due_date) {
    const dt = new Date(data.due_date);
    const due_date = dt.toJSON().split('T')[0];
    data.due_date = due_date;
  }

  const insertQuery = `INSERT INTO ${tbl_records}(amount, contact_id, record_type, due_date, short_note) 
  values('${data.amount}', '${data.contact_id}', '${data.record_type}', '${data.due_date}', '${data.short_note}')`;

  // return db.executeSql(insertQuery, [checklist.title, checklist.created_at]);
  return db.executeSql(insertQuery);
};

export const getAllRecords = async db => {
  try {
    let records = [];
    const results = await db.executeSql(
      `SELECT a.*, b.name as contact
      FROM ${tbl_records} a
      LEFT JOIN ${tbl_contacts} b on a.contact_id = b.id
      order by a.created_at desc;`,
    );

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        let item = result.rows.item(index);
        item.formatted_created_at = formatDate(item.created_at.split(' ')[0]);
        records.push(item);
      }
    });

    return records;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get data !!!');
  }
};

export const getRecordById = async (db, id) => {
  try {
    let data = null;
    const results = await db.executeSql(
      `SELECT a.*, b.name as contact
      FROM ${tbl_records} a
      LEFT JOIN ${tbl_contacts} b on a.contact_id = b.id
      WHERE a.id = ${id}`,
    );
    const rows = results[0].rows;
    if (rows.length) {
      data = rows.item(0);
      data.formatted_created_at = formatDate(data.created_at.split(' ')[0]);
      if (data.due_date) {
        data.formatted_due_date = formatDate(data.due_date);
      }
    }
    return data;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get data !!!');
  }
};

export const getPaymentsByRecordId = async (db, record_id) => {
  try {
    let payments = [];
    const results = await db.executeSql(
      `SELECT * FROM ${tbl_payments} WHERE record_id = ${record_id} order by id desc;`,
    );

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        let item = result.rows.item(index);
        item.formatted_record_date = formatDate(item.record_date.split(' ')[0]);
        payments.push(item);
      }
    });

    return payments;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get data !!!');
  }
};

export const recordClose = async (db, id) => {
  const insertQuery = `UPDATE ${tbl_records} SET is_closed = 1 where id = ${id};`;
  return db.executeSql(insertQuery);
};

export const createNewPayment = async (db, data) => {
  if (data.record_date) {
    const dt = new Date(data.record_date);
    const record_date = dt.toJSON().split('T')[0];
    data.record_date = record_date;
  }

  const insertQuery = `INSERT INTO ${tbl_payments}(amount, record_id, record_date) 
  values('${data.amount}', '${data.record_id}', '${data.record_date}')`;

  // return db.executeSql(insertQuery, [checklist.title, checklist.created_at]);
  return db.executeSql(insertQuery);
};

export const deletePaymentById = async (db, id) => {
  const query = `DELETE FROM ${tbl_payments} where id = ${id};`;
  return db.executeSql(query);
};

const formatDate = date => {
  let dt = new Date(date);
  let mon = months[dt.getMonth()];
  return `${dt.getDate()} ${mon}, ${dt.getFullYear()}`;
};

/* export const getChecklists = async db => {
  try {
    const checklists = [];
    const results = await db.executeSql(
      `SELECT a._id, a.title, a.is_pinned, a.created_at, count(b._id) as itemCount, 
      sum(case when b.is_completed = 1 then 1 else 0 end) as completedCount
      FROM ${table_checklist} a
      LEFT JOIN ${table_checklist_items} b on a._id = b.checklist_id
      group by a._id
      order by a._id desc`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        let item = result.rows.item(index);
        let dt = new Date(item.created_at);
        let mon = months[dt.getMonth()];
        let formatted_dt = `${dt.getDate()} ${mon}, ${dt.getFullYear()}`;
        item.formatted_dt = formatted_dt;
        checklists.push(item);
      }
    });
    return checklists;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const saveNewChecklist = async (db, checklist) => {
  // const insertQuery = `INSERT INTO ${table_checklist}(title, created_at) values (?, ?)`;
  let created_at = new Date();
  const insertQuery = `INSERT INTO ${table_checklist}(title, created_at) values('${checklist.title}', '${created_at}')`;

  // return db.executeSql(insertQuery, [checklist.title, checklist.created_at]);
  return db.executeSql(insertQuery);
};

export const getChecklistById = async (db, id) => {
  try {
    let data = null;
    const results = await db.executeSql(
      `SELECT * from ${table_checklist} where _id = ${id}`,
    );
    const rows = results[0].rows;
    data = rows.item(0);
    return data;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get data !!!');
  }
};

export const getItemsById = async (db, id) => {
  try {
    const data = [];
    const results = await db.executeSql(
      `SELECT * from ${table_checklist_items} where checklist_id = ${id} order by _id desc`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        data.push(result.rows.item(index));
      }
    });
    return data;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const toggleItemComplete = async (db, id, is_completed) => {
  is_completed = is_completed ? 1 : 0;
  const insertQuery = `UPDATE ${table_checklist_items} SET is_completed = ${is_completed} where _id = ${id};`;
  return db.executeSql(insertQuery);
};

export const deleteItemById = async (db, id) => {
  const query = `DELETE FROM ${table_checklist_items} where _id = ${id};`;
  return db.executeSql(query);
}; */
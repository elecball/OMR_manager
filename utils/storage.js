const fs = require('fs');

class Storage {
  static data = new Map();

  static load() {
    let str = fs.readFileSync('data.json');
    let obj = JSON.parse(str);
    for (const key in obj) {
      this.data.set(key, obj[key]);
    }
  }

  static save() {
    fs.writeFileSync('data.json', JSON.stringify(Object.fromEntries(this.data), null, 2));
  }

  static json() {
    return JSON.stringify(Object.fromEntries(this.data));
  }

  static get(user) {
    return this.data.get(user);
  }

  static apply(user) {
    this.data.set(user, {});
    this.data.get(user).applyDate = Date.now();
    this.save();
  }

  static ans(user, ans) {
    try {
      let val = JSON.parse(ans);
      this.data.get(user).ans = val;
    } catch (_) {

    }
    this.save();
  }
}

module.exports = Storage;
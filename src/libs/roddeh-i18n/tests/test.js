// Generated by CoffeeScript 1.12.7

/*

MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

(function() {
  var assert, con, en, i18n, ja, pt;

  con = console;

  i18n = require("../dist/i18n");

  assert = function(val, expected) {
    if (val === expected) {
      return con.log("PASS -> " + val);
    } else {
      return con.error("\033[31m" + ("FAIL -> Expected: '" + expected + "' but got '" + val + "'") + "\033[0m");
    }
  };

  ja = i18n.create({
    values: {
      "Cancel": "キャンセル"
    }
  });

  en = i18n.create({
    values: {
      "Cancel": "Cancel",
      "%n comments": [[null, null, "Comments disabled"], [0, 0, "%n comments"], [1, 1, "%n comment"], [2, null, "%n comments"]],
      "Due in %n days": [[null, null, "Expired"], [null, -2, "Due -%n days ago"], [-1, -1, "Due Yesterday"], [0, 0, "Due Today"], [1, 1, "Due Tomorrow"], [2, null, "Due in %n days"]]
    },
    contexts: [
      {
        "matches": {
          "gender": "male"
        },
        "values": {
          "%{name} uploaded %n photos to their %{album} album": [[0, 0, "%{name} uploaded %n photos to his %{album} album"], [1, 1, "%{name} uploaded %n photo to his %{album} album"], [2, null, "%{name} uploaded %n photos to his %{album} album"]]
        }
      }, {
        "matches": {
          "gender": "female"
        },
        "values": {
          "%{name} uploaded %n photos to their %{album} album": [[0, 0, "%{name} uploaded %n photos to her %{album} album"], [1, 1, "%{name} uploaded %n photo to her %{album} album"], [2, null, "%{name} uploaded %n photos to her %{album} album"]]
        }
      }
    ]
  });

  pt = i18n.create({
    values: {
      "Cancel": "Cancelar"
    }
  });

  assert(i18n("Hello"), "Hello");

  assert(en("Cancel"), "Cancel");

  assert(pt("Cancel"), "Cancelar");

  assert(i18n("Cancel"), "Cancel");

  i18n.translator.add({
    values: {
      "Hello": "こんにちは",
      "Yes": "はい",
      "No": "いいえ",
      "Ok": "Ok",
      "Cancel": "キャンセル",
      "%n comments": [[0, null, "%n コメント"]],
      "_monkeys": "猿も木から落ちる"
    },
    contexts: [
      {
        "matches": {
          "gender": "male"
        },
        "values": {
          "%{name} uploaded %n photos to their %{album} album": [[0, null, "%{name}は彼の%{album}アルバムに写真%n枚をアップロードしました"]]
        }
      }, {
        "matches": {
          "gender": "female"
        },
        "values": {
          "%{name} uploaded %n photos to their %{album} album": [[0, null, "%{name}は彼女の%{album}アルバムに写真%n枚をアップロードしました"]]
        }
      }
    ]
  });

  assert(i18n("Hello"), "こんにちは");

  assert(i18n("%n comments", 0), "0 コメント");

  assert(i18n("%n comments", 1), "1 コメント");

  assert(i18n("%n comments", 2), "2 コメント");

  assert(en("%n comments", null), "Comments disabled");

  assert(en("%n comments", 0), "0 comments");

  assert(en("%n comments", 1), "1 comment");

  assert(en("%n comments", 2), "2 comments");

  assert(en("Due in %n days", null), "Expired");

  assert(en("Due in %n days", -2), "Due 2 days ago");

  assert(en("Due in %n days", -1), "Due Yesterday");

  assert(en("Due in %n days", 0), "Due Today");

  assert(en("Due in %n days", 1), "Due Tomorrow");

  assert(en("Due in %n days", 2), "Due in 2 days");

  assert(i18n("Welcome %{name}", {
    name: "John"
  }), "Welcome John");

  assert(i18n("_short_key", "This is a long piece of text"), "This is a long piece of text");

  assert(i18n("_monkeys"), "猿も木から落ちる");

  assert(en("%{name} uploaded %n photos to their %{album} album", 1, {
    name: "John",
    album: "Buck's Night"
  }, {
    gender: "male"
  }), "John uploaded 1 photo to his Buck's Night album");

  assert(en("%{name} uploaded %n photos to their %{album} album", 4, {
    name: "Jane",
    album: "Hen's Night"
  }, {
    gender: "female"
  }), "Jane uploaded 4 photos to her Hen's Night album");

  assert(i18n("%{name} uploaded %n photos to their %{album} album", 1, {
    name: "John",
    album: "Buck's Night"
  }, {
    gender: "male"
  }), "Johnは彼のBuck's Nightアルバムに写真1枚をアップロードしました");

  assert(i18n("%{name} uploaded %n photos to their %{album} album", 4, {
    name: "Jane",
    album: "Hen's Night"
  }, {
    gender: "female"
  }), "Janeは彼女のHen's Nightアルバムに写真4枚をアップロードしました");

}).call(this);

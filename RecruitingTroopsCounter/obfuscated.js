// ==UserScript==
// @name         TroopsCounter
// @description  Script to count all the troops, including the ones that are being recruted
// @version      1.0
// @author       TiagoPer
// @match        https://*/*screen=barracks*
// @match        https://*/*screen=garage*
// @match        https://*/*screen=stable*
// @icon         https://dspt.innogamescdn.com/asset/5b5eb006/graphic/big_buildings/barracks3.png
// ==/UserScript==

function _0x321d(_0x282d69, _0x5bc9f4) {
  const _0x24c38b = _0x24c3();
  return (
    (_0x321d = function (_0x321df9, _0x48393a) {
      _0x321df9 = _0x321df9 - 0x154;
      let _0x11f7ae = _0x24c38b[_0x321df9];
      return _0x11f7ae;
    }),
    _0x321d(_0x282d69, _0x5bc9f4)
  );
}
(function (_0x2f9308, _0xad25cc) {
  const _0x50b808 = _0x321d,
    _0x420959 = _0x2f9308();
  while (!![]) {
    try {
      const _0x5c2536 =
        -parseInt(_0x50b808(0x168)) / 0x1 +
        (-parseInt(_0x50b808(0x16d)) / 0x2) *
          (-parseInt(_0x50b808(0x166)) / 0x3) +
        -parseInt(_0x50b808(0x155)) / 0x4 +
        (parseInt(_0x50b808(0x174)) / 0x5) *
          (parseInt(_0x50b808(0x160)) / 0x6) +
        parseInt(_0x50b808(0x164)) / 0x7 +
        -parseInt(_0x50b808(0x15d)) / 0x8 +
        (-parseInt(_0x50b808(0x158)) / 0x9) *
          (-parseInt(_0x50b808(0x165)) / 0xa);
      if (_0x5c2536 === _0xad25cc) break;
      else _0x420959["push"](_0x420959["shift"]());
    } catch (_0x440623) {
      _0x420959["push"](_0x420959["shift"]());
    }
  }
})(_0x24c3, 0x83dfa),
  (function () {
    let _0x5998bb = {
        spear: 0x0,
        sword: 0x0,
        axe: 0x0,
        spy: 0x0,
        light: 0x0,
        heavy: 0x0,
        ram: 0x0,
        catapult: 0x0,
      },
      _0x39c520 = {
        spear: 0x0,
        sword: 0x0,
        axe: 0x0,
        spy: 0x0,
        light: 0x0,
        heavy: 0x0,
        ram: 0x0,
        catapult: 0x0,
      };
    function _0x310c24() {
      const _0x29fb6f = _0x321d,
        _0x1348c9 = /\d+/g;
      let _0x32f660 = $(_0x29fb6f(0x161));
      _0x32f660["each"]((_0x5b88c4, _0x2001ea) => {
        const _0x2718b3 = _0x29fb6f;
        let _0x5497fd = $(_0x2001ea)
            [_0x2718b3(0x154)]("td")
            ["eq"](0x0)
            ["find"]("div"),
          _0x4ac286 = _0x5497fd[_0x2718b3(0x173)](_0x2718b3(0x157))[
            _0x2718b3(0x15b)
          ](_0x2718b3(0x15f), ""),
          _0x985a12 = $(_0x2001ea)
            [_0x2718b3(0x154)]("td")
            ["eq"](0x0)
            [_0x2718b3(0x16e)](),
          _0x1903a6 = parseInt(_0x985a12[_0x2718b3(0x15c)](_0x1348c9));
        _0x5998bb[_0x4ac286] += _0x1903a6;
      });
      let _0x57cdb9 = $(_0x29fb6f(0x169));
      console[_0x29fb6f(0x167)](_0x57cdb9);
      if (_0x57cdb9[_0x29fb6f(0x16a)] > 0x0) {
        let _0x13179a = $(_0x57cdb9)
            [_0x29fb6f(0x154)]("td")
            ["eq"](0x0)
            [_0x29fb6f(0x154)]("div")
            [_0x29fb6f(0x173)]("class")
            [_0x29fb6f(0x15b)](_0x29fb6f(0x15f), ""),
          _0xb31951 = parseInt(
            $(_0x57cdb9)
              [_0x29fb6f(0x154)]("td")
              [_0x29fb6f(0x16e)]()
              ["match"](_0x1348c9)
          );
        _0x5998bb[_0x13179a] += _0xb31951;
      }
    }
    function _0xb6dc22() {
      let _0x5d858b = $("#train_form\x20tr.row_a");
      _0x5d858b["each"]((_0x1cd672, _0x5f5d6a) => {
        const _0x2aaf87 = _0x321d;
        let _0x41b20b = $(_0x5f5d6a)
            [_0x2aaf87(0x154)]("td")
            ["eq"](0x0)
            [_0x2aaf87(0x154)]("a")
            ["eq"](0x0)
            [_0x2aaf87(0x173)](_0x2aaf87(0x170)),
          _0x43cfb6 = $(_0x5f5d6a)
            [_0x2aaf87(0x154)]("td")
            ["eq"](0x2)
            [_0x2aaf87(0x16e)]();
        const _0x16f104 = /(\d+)\/(\d+)/;
        let _0x1c62bb = parseInt(_0x43cfb6[_0x2aaf87(0x15c)](_0x16f104)[0x2]);
        _0x39c520[_0x41b20b] += _0x1c62bb;
      });
    }
    function _0xb50f40() {
      const _0x507329 = _0x321d,
        _0x529083 = [],
        _0xd19256 = new Promise((_0x402e43) => {
          _0x310c24(), _0x402e43();
        }),
        _0x427a9a = new Promise((_0x3143fb) => {
          _0xb6dc22(), _0x3143fb();
        });
      _0x529083[_0x507329(0x16c)](_0xd19256, _0x427a9a),
        Promise[_0x507329(0x163)](_0x529083)[_0x507329(0x15a)](() =>
          _0x2c4160()
        );
    }
    function _0x2c4160() {
      const _0xafe21f = _0x321d;
      let _0x3fe39a = $(_0xafe21f(0x16b));
      $(_0x3fe39a)
        ["find"]("tr")
        ["eq"](0x0)
        [_0xafe21f(0x154)]("th")
        ["eq"](0x2)
        [_0xafe21f(0x16f)](_0xafe21f(0x171));
      let _0x47dd0c = $("#train_form\x20tr.row_a");
      _0x47dd0c[_0xafe21f(0x172)]((_0x3199d9, _0x20f4ac) => {
        const _0x58dc17 = _0xafe21f;
        let _0xb418e0 = $(_0x20f4ac)
            [_0x58dc17(0x154)]("td")
            ["eq"](0x0)
            ["find"]("a")
            ["eq"](0x0)
            ["attr"](_0x58dc17(0x170)),
          _0x4358a8 = _0x5998bb[_0xb418e0] + _0x39c520[_0xb418e0];
        $(_0x20f4ac)
          ["find"]("td")
          ["eq"](0x2)
          [_0x58dc17(0x16f)](_0x58dc17(0x162) + _0x4358a8 + _0x58dc17(0x15e));
      }),
        $(_0x3fe39a)
          [_0xafe21f(0x154)](_0xafe21f(0x159))
          [_0xafe21f(0x154)]("td")
          ["eq"](0x0)
          [_0xafe21f(0x173)](_0xafe21f(0x156), "4");
    }
    _0xb50f40();
  })();
function _0x24c3() {
  const _0x16e1b7 = [
    "match",
    "6818792qHgcgb",
    "</td>",
    "unit_sprite\x20unit_sprite_smaller\x20",
    "6vjmUgu",
    "#trainqueue_barracks\x20tr.sortable_row",
    "<td\x20style=\x22text-align:\x20center\x22>",
    "all",
    "7537089oZLicD",
    "10FUORil",
    "3qfqGUM",
    "log",
    "117900JIxdox",
    ".trainqueue_wrap\x20tr.lit:first",
    "length",
    "#train_form",
    "push",
    "534764WuTQKI",
    "text",
    "after",
    "data-unit",
    "<th>Total</th>",
    "each",
    "attr",
    "1402015hwBoEN",
    "find",
    "1229584rflBSY",
    "colspan",
    "class",
    "1739583sDuHau",
    "tr:last",
    "then",
    "replace",
  ];
  _0x24c3 = function () {
    return _0x16e1b7;
  };
  return _0x24c3();
}

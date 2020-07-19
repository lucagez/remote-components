export default `
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Dummy = function Dummy(props) {
  return /*#__PURE__*/_react["default"].createElement("h1", null, props.description);
};

var _default = Dummy;
exports["default"] = _default;
`;

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _draggableResizableBox = require('./draggable-resizable-box');

var _draggableResizableBox2 = _interopRequireDefault(_draggableResizableBox);

var _dataUriToBlob = require('data-uri-to-blob');

var _dataUriToBlob2 = _interopRequireDefault(_dataUriToBlob);

require('./cropper.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_React$Component) {
  _inherits(_class, _React$Component);

  _createClass(_class, [{
    key: 'getDefaultProps',
    value: function getDefaultProps() {
      return {
        center: false,
        width: 'Width',
        height: 'Height',
        offsetXLabel: 'Offset X',
        offsetYLabel: 'Offset Y'
      };
    }
  }]);

  function _class(props) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

    _this.displayName = 'Cropper';
    _this.propTypes = {
      width: _propTypes2.default.number.isRequired,
      height: _propTypes2.default.number.isRequired,
      center: _propTypes2.default.bool,
      image: _propTypes2.default.any,
      widthLabel: _propTypes2.default.string,
      heightLabel: _propTypes2.default.string,
      offsetXLabel: _propTypes2.default.string,
      offsetYLabel: _propTypes2.default.string,
      onImageLoaded: _propTypes2.default.func,
      minConstraints: _propTypes2.default.arrayOf(_propTypes2.default.number)
    };

    _this.onLoad = function (evt) {
      var box = _this.refs.box.getBoundingClientRect();
      _this.setState({
        imageLoaded: true,
        width: box.width,
        height: box.height
      }, function () {
        var img = _this.refs.image;
        _this.props.onImageLoaded && _this.props.onImageLoaded(img);
      });
    };

    _this.cropImage = function () {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
          var canvas = _this.refs.canvas;
          var img = _this.refs.image;
          var ctx = canvas.getContext('2d');
          var xScale = img.naturalWidth / _this.state.width,
              yScale = img.naturalHeight / _this.state.height;


          var imageOffsetX = xScale < 1 ? 0 : _this.state.offset.left * xScale;
          var imageOffsetY = yScale < 1 ? 0 : _this.state.offset.top * yScale;
          var imageWidth = xScale < 1 ? img.naturalWidth : _this.state.dimensions.width * xScale;
          var imageHeight = yScale < 1 ? img.naturalHeight : _this.state.dimensions.height * yScale;

          var canvasOffsetX = xScale < 1 ? Math.floor((_this.state.dimensions.width - img.naturalWidth) / 2) : 0;
          var canvasOffsetY = yScale < 1 ? Math.floor((_this.state.dimensions.height - img.naturalHeight) / 2) : 0;
          var canvasWidth = xScale < 1 ? img.naturalWidth : _this.props.width;
          var canvasHeight = yScale < 1 ? img.naturalHeight : _this.props.height;

          ctx.clearRect(0, 0, _this.props.width, _this.props.height);
          ctx.drawImage(img, imageOffsetX, imageOffsetY, imageWidth, imageHeight, canvasOffsetX, canvasOffsetY, canvasWidth, canvasHeight);
          resolve((0, _dataUriToBlob2.default)(canvas.toDataURL()));
        };
        img.src = window.URL.createObjectURL(_this.props.image);
      });
    };

    _this.onChange = function (offset, dimensions) {
      _this.setState({ offset: offset, dimensions: dimensions });
    };

    _this.state = {
      imageLoaded: false,
      width: _this.props.width,
      height: _this.props.height,
      url: window.URL.createObjectURL(_this.props.image)
    };
    return _this;
  }

  _createClass(_class, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.image !== nextProps.image) {
        this.setState({
          url: window.URL.createObjectURL(nextProps.image),
          imageLoaded: false
        });
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var image = this.props.image;

      return nextProps.image.size !== image.size || nextProps.image.name !== image.name || nextProps.image.type !== image.type || nextState.imageLoaded !== this.state.imageLoaded;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          ref: 'box',
          className: 'Cropper',
          style: {
            minWidth: this.props.width,
            minHeight: this.props.height
          } },
        _react2.default.createElement('canvas', {
          className: 'Cropper-canvas',
          ref: 'canvas',
          width: this.props.width,
          height: this.props.height }),
        _react2.default.createElement('img', {
          ref: 'image',
          src: this.state.url,
          className: 'Cropper-image',
          onLoad: this.onLoad,
          style: { top: this.state.height / 2 } }),
        this.state.imageLoaded && _react2.default.createElement(
          'div',
          { className: 'box' },
          _react2.default.createElement(
            _draggableResizableBox2.default,
            {
              aspectRatio: this.props.width / this.props.height,
              width: this.state.width,
              height: this.state.height,
              minConstraints: this.props.minConstraints,
              onChange: this.onChange,
              widthLabel: this.props.widthLabel,
              heightLabel: this.props.heightLabel,
              offsetXLabel: this.props.offsetXLabel,
              offsetYLabel: this.props.offsetYLabel },
            _react2.default.createElement('div', { className: 'Cropper-box' })
          )
        )
      );
    }
  }]);

  return _class;
}(_react2.default.Component);

exports.default = _class;

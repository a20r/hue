
var throttle = function(func, limit) {
  var inThrottle,
    lastFunc,
    lastRan;
  return function() {
    var context = this,
      args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now()
      inThrottle = true;
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  };
};

class LightSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.id = "light-state-checkbox-" + this.props.lightId;
    }

    render() {
        return <div className="switch">
                <label>
                    Off
                    <input id={this.id}
                        type="checkbox" />
                    <span className="lever"></span>
                    On
                </label>
            </div>;
    }

    componentDidMount() {
        var self = this;
        $("#" + this.id).change(function()
        {
            $.ajax({
                url: "/state",
                type: "POST",
                data: JSON.stringify({
                    light: self.props.lightId,
                    state: this.checked
                }),
                contentType:"application/json; charset=utf-8",
                dataType: "json"
            });
        });
    }
}

class LightColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.id = "light-color-picker-" + this.props.lightId;
    }

    render() {
        return <div className="color-picker" id={this.id}
            onTouchMove={this.onTouchMove.bind(this)}></div>;
    }

    componentDidMount() {
        var self = this;
        var cw = 0.5 * $("#" + this.id).width();
        $("#" + this.id).css("height", cw + "px");
    }

    changeLightColor = throttle(function(hue, li) {
        $.ajax({
            url: "/color",
            type: "POST",
            data: JSON.stringify({
                light: this.props.lightId,
                hue: hue,
                saturation: li
            }),
            contentType:"application/json; charset=utf-8",
            dataType: "json"
        });
    }.bind(this), 150);

    onTouchMove(e) {
        e.preventDefault();
        e.stopPropagation();
        var touch = e.touches[0]
        var elem = $("#" + this.id);
        var rect = elem[0].getBoundingClientRect();
        var x = touch.clientX - rect.left;
        var y = touch.clientY - rect.top;
        var hue = Math.round(360 * x / elem.width());
        var li = 50 + Math.round(50 * y / elem.height());
        elem.css("background-color", "hsl(" + hue + ", 100%, " + li + "%)");
        this.changeLightColor(hue, li);
    }
}

class OldLightColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.id = "light-color-picker-" + this.props.lightId;
    }

    render() {
        return <input type="text" id={this.id}/>;
    }

    componentDidMount() {
        var self = this;
        $("#" + this.id).spectrum({
            flat: true,
            cancelText: "",
            showPalette: false,
            showButtons: false,
            containerClassName: "color-picker",
            move: throttle(function(color) {
                var hsv = color.toHsv();
                $.ajax({
                    url: "/color",
                    type: "POST",
                    data: JSON.stringify({
                        light: self.props.lightId,
                        hue: hsv.h,
                        saturation: hsv.s
                    }),
                    contentType:"application/json; charset=utf-8",
                    dataType: "json"
                });
            }, 150)
        });
    }
}

class LightBrightnessSlider extends React.Component {
    constructor(props) {
        super(props);
        this.id = "light-brightness-slider-" + props.lightId;
    }

    render() {
        return <p className="range-field">
            <input type="range" id={this.id} min="0" max="255"
                defaultValue="0"/>
        </p>
    }

    componentDidMount() {
        var self = this;
        $("#" + this.id).on("input", throttle(function() {
            $.ajax({
                url: "/brightness",
                type: "POST",
                data: JSON.stringify({
                    light: self.props.lightId,
                    brightness: $("#" + self.id).val()
                }),
                contentType:"application/json; charset=utf-8",
                dataType: "json"
            });
        }, 150));
    }
}

class LightTemperatureSlider extends React.Component {
    constructor(props) {
        super(props);
        this.id = "light-temperature-slider-" + props.lightId;
    }

    render() {
        return <p className="range-field">
            <input type="range" id={this.id} min="153" max="500"
                defaultValue="153"/>
        </p>
    }

    componentDidMount() {
        var self = this;
        $("#" + this.id).on("input", throttle(function() {
            $.ajax({
                url: "/temperature",
                type: "POST",
                data: JSON.stringify({
                    light: self.props.lightId,
                    temperature: $("#" + self.id).val()
                }),
                contentType:"application/json; charset=utf-8",
                dataType: "json"
            });
        }, 150));
    }
}

class LightName extends React.Component {
    constructor(props) {
        super(props);
        this.id = "light-name-" + props.lightId;
    }

    render() {
        return <input type="text" className="editable-name"
            defaultValue={this.props.name} />
    }
}

function FormLabel(props) {
    var labelFor = props.name + "-" + props.lightId;
    return <label htmlFor={labelFor}>{props.val}</label>;
}

function LightBrightnessSliderForm(props) {
    return  <div className="row">
        <div className="input-field col s12">
            <FormLabel name="light-brightness-slider"
                lightId={props.lightId}
                val="Brightness" />
            <br/>
            <LightBrightnessSlider lightId={props.lightId} />
        </div>
    </div>;
}

function LightTemperatureSliderForm(props) {
    return <div className="row">
        <div className="input-field col s12">
            <FormLabel name="light-brightness-slider"
                lightId={props.lightId}
                val="Temperature" />
            <br/>
            <LightTemperatureSlider lightId={props.lightId} />
        </div>
    </div>;
}

function LightColorPickerForm(props) {
    return  <div className="row">
        <div className="input-field col s12">
            <LightColorPicker lightId={props.lightId} />
        </div>
    </div>;
}

function ColorLightPanel(props) {
    return <div className="card horizontal">
        <div className="card-stacked">
            <div className="card-content">
                <span className="card-title">
                    {props.name}
                </span>
                <form className="col s12">
                    <LightColorPickerForm lightId={props.lightId} />
                    <LightBrightnessSliderForm lightId={props.lightId} />
                    <LightTemperatureSliderForm lightId={props.lightId} />
                </form>
            </div>
            <div className="card-action">
                <LightSwitch lightId={props.lightId} />
            </div>
        </div>
    </div>;
}

function WhiteLightPanel(props) {
    return <div className="card horizontal">
        <div className="card-stacked">
            <div className="card-content">
                <span className="card-title">
                    {props.name}
                </span>
                <form className="col s12">
                    <LightBrightnessSliderForm lightId={props.lightId} />
                </form>
            </div>
            <div className="card-action">
                <LightSwitch lightId={props.lightId} />
            </div>
        </div>
    </div>;
}

// function LightPanel() {
//     return <div>
//         <ColorLightPanel lightId="3" name="Next to TV" />
//         <WhiteLightPanel lightId="2" name="Next to bed" />
//     </div>;
// }

// ReactDOM.render(
//     <LightPanel />,
//     document.getElementById("lights")
// );

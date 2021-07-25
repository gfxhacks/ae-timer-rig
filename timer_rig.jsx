// Usage: In AE 2020 (17.0) or above, create a new composition or open an existing one. Then choose File -> Scripts -> Run Script File... to launch this script.

/*
    Title: timer_rig.jsx
    Author: gfxhacks.com
    Description: Create a new Timer object in the active After Effects composition.
    More Info: https://gfxhacks.com/timer-rig-in-after-effects-using-expressions
*/

app.beginUndoGroup("Create Timer");

// define timer expression
exp = '// get Timer properties\nrate = clamp(effect("Rate")("Slider"), 0, 100);\nh = effect("Start Time - Hours")("Slider");\nm = effect("Start Time - Minutes")("Slider");\ns = effect("Start Time - Seconds")("Slider");\nc = effect("Countdown")("Checkbox").value;\nms = effect("Milliseconds")("Checkbox").value;\nformat = effect("Time Format")("Menu").value;\nn = effect("Negative Time")("Checkbox").value;\n// convert Start Times to seconds and sum.\nst = h*3600 + m*60 + s;\n// count up or count down based on checkbox value\nt = c ? st - rate*(time - inPoint) : st + rate*(time - inPoint);\n// initialize time as [HH:MM:SS:MSS]\nf = t <= 0 ? [00, 00, 00, 000] : [t/3600, (t%3600)/60, t%60, t.toFixed(3).substr(-3)];\n// Round to whole numbers and add zero padding\nfor (i in f){ f[i] = String(Math.floor(f[i])).padStart(i>2?3:2, "0") }\n// remove ms if checkbox is off\nif(!ms) f.pop();\n// change Timer display based on chosen format\nswitch (format){\n    // HH:MM:SS\n    case 1:\n        t = f.join(":");\n        break;\n    // MM:SS\n    case 2:\n        t = f.slice(1).join(":");\n        break;\n    // SS\n    case 3:\n        t = f.slice(2).join(":");\n}\n// prepend minus symbol to time if checkbox is on\nn ? "-" + t : t;';

// define expression control effects
effects = [
    {
        "type": "Checkbox Control",
        "name": "Countdown",
        "value": "1"
        },
    {
        "type": "Dropdown Menu Control",
        "name": "Time Format",
        "value": ["HH:MM:SS", "MM:SS", "SS"]
        },
    {
        "type": "Slider Control",
        "name": "Rate",
        "value": "1"
        },
    {
        "type": "Slider Control",
        "name": "Start Time - Hours",
        "value": "24"
        },

    {
        "type": "Slider Control",
        "name": "Start Time - Minutes",
        "value": "0"
        },

    {
        "type": "Slider Control",
        "name": "Start Time - Seconds",
        "value": "0"
        },

    {
        "type": "Checkbox Control",
        "name": "Milliseconds",
        "value": "1"
        },

    {
        "type": "Checkbox Control",
        "name": "Negative Time",
        "value": "0"
        },

    ]


try {
    // get current comp
    c = app.project.activeItem;
    // add new text layer
    t = c.layers.addText();
    // rename text layer
    t.name = "Timer";
    
    try {
        for (i in effects) {
            // get current expression control effect
            e = effects[i];
            // add current expression control effect
            s = t.property('Effects').addProperty(e.type);
            // get current expression control effect index
            id = s.propertyIndex;
            // check if effect is of type dropdown, then set values.
            // Dropdown Menu effect (new in 2020) is the only effect that requires to set values with: setPropertyParameters
            s.property(1).isDropdownEffect ? s.property(1).setPropertyParameters(e.value) : s.property(1).setValue(e.value);
            // rename effect using index reference - previous reference is lost when setting values.
            t.property('Effects')(id).name = e.name;
        }

        // add timer expression to source text
        t.text.sourceText.expression = exp;
    } catch (e) {
        alert('Script Failed!\nDropdown Menu control not found. Make sure you are running AE 2020 (17.0) or above.')
    }

} catch (e) {
    alert('Create or open a composition first!');
}

// add expression control effects to text layer

app.endUndoGroup();


import {o, c, bind, cls, click} from 'carbyne';

import {Icon} from './icon';

import {inkable} from './ink'
import './checkbox.styl';

var OFF = 'square-o';
var ON = 'check-square';
var INDETERMINATE = 'minus-square';

export function Checkbox(attrs, children) {

  let data = {
    model: o(attrs.model || undefined),
    disabled: o(attrs.disabled)
  };

  function toggle(event) {
    if (data.disabled.get()) return;

    let val = data.model.get();
    data.model.set(!val);
  }

  function getIcon(value) {
    if (value === undefined) return INDETERMINATE;
    if (value) return ON;
    return OFF;
  }

  let classes = cls({on: data.model, off: o(data.model, (v) => !v), disabled: data.disabled});

  return <label class='carbm-checkbox-label' $$={[inkable, click(toggle)]}>
      <Icon class='carbm-checkbox-icon' name={o(data.model, getIcon)}
        $$={classes}/>
      <span class='carbm-checkbox-content' $$={classes}>{attrs.title || children}</span>
    </label>;

}

import {
  o,
  Component,
  click,
  DisplayIf,
  RO,
  Attrs,
  Listener
} from 'elt'

import {Css} from './styling'
import {Icon} from './icon'
import {Flex} from './flex'
import {inker} from './ink'


export interface ButtonAttrs extends Attrs {
  bordered?: RO<boolean>
  disabled?: RO<boolean>
  raised?: RO<boolean>
  click?: Listener<MouseEvent>
  icon?: RO<string>
}


export function Button(attrs : ButtonAttrs, children: DocumentFragment): Element {

  function doClick(this: Node, event: MouseEvent, node: Node) {
    let click = o.get(attrs.click)
    if (!o.get(attrs.disabled)) {
      // in this context, this is the Node.
      var n = event.target as Node
      inker(n === node ? n.firstChild! : n, event)
      click && click.call(this, event, node)
    }
  }

  return <button
    class={[Button.button, {[Css.colors.reverse_primary]: attrs.raised}]}
    disabled={o(attrs.disabled).tf(val => !!val)}
    $$={click(doClick)}
  >
    {DisplayIf(o(attrs.icon),
      o_name => <Icon
        class={[
          Button.base_button,
          Button.button_icon,
          {[Button.disabled]: attrs.disabled, [Css.raised]: attrs.raised, [Button.bordered]: attrs.bordered}
        ]}
        name={o_name}
      />
    ,
      () => <span
        class={[
          Button.base_button,
          Button.button_content,
          {[Button.disabled]: attrs.disabled, [Css.raised]: attrs.raised, [Button.bordered]: attrs.bordered}
        ]}
      >
        {children}
      </span>
    )}

  </button>

}


export namespace Button {
  const s = Css.s

  export const button = Css('button',
    Css.no_spurious_borders,
    {
      // This style applies to a button, that we want to completely reset.
      border: 0,
      margin: 0,
      background: 'none',
      position: 'relative',
      display: 'inline-block',
      cursor: 'pointer',
      // padding: '8px', // this is to allow more space for touch events.
    },
  )

  s(button).append(`::-moz-focus-inner`, {border: 0})

  export const base_button = Css('base-button',
    Css.no_spurious_borders,
    {
      verticalAlign: 'middle',
      color: Css.colors.PRIMARY,
      background: Css.colors.BG,
      display: 'inline-block',
      textAlign: 'center',
      cursor: 'pointer',
      position: 'relative' // needed for inker.
    }
  )

  export const button_content = Css('button-content', {
    minWidth: '64px',
    textTransform: 'uppercase',
    fontWeight: 'bold',

    // Should probably have a mixin for that
    // as it should be some global configuration option.
    borderRadius: '2px',
    borderStyle: 'none',

    padding: `0 6px`,
    lineHeight: '36px',
    height: '36px',
    userSelect: 'none'
  })

  export const button_icon = Css('button-icon')

  s(button_icon).append(`::before`, {
    fontSize: '24px',
    color: Css.colors.PRIMARY
  })

  export const bordered = Css('bordered', {
    border: `1px solid`,
    borderColor: Css.colors.PRIMARY
  })

  export const disabled = Css('disabled', {
    color: Css.colors.FG4,
    boxShadow: 'none'
  })

  export const icon_button = Css('icon-button')
  s(icon_button).append('::before', {fontSize: '24px'})

  s(button).after(s(button), {
    marginLeft: 0,
    marginTop: 0
  })

}


export interface ButtonBarAttrs extends Attrs {
  stacked?: boolean
}


export class ButtonBar extends Component<ButtonBarAttrs> {

  inserted(node: Element, parent: Element) {
    parent.classList.add(ButtonBar.has_button_bar)
  }

  removed(node: Element, parent: Element) {
    parent.classList.remove(ButtonBar.has_button_bar)
  }

  render(children: DocumentFragment): Element {
    return <div class={[ButtonBar.button_bar, Flex.row, Flex.justify_end]}>{children}</div>
  }
}

export namespace ButtonBar {
  export const button_bar = Css('button-bar')
  Css.s(Button.button).childOf(button_bar, {paddingBottom: 0})

  export const has_button_bar = Css('has-button-bar', {
    paddingBottom: '0 !important'
  })

}

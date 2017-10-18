
import {
	Attrs,
	e,
} from 'elt'

import {style} from 'typestyle'
import * as t from 'csstips'

export namespace CSS {

	export const wrap = style(t.wrap)
	export const horizontal = style(t.horizontal)
	export const vertical = style(t.vertical)

	export const around = style(t.aroundJustified)
	export const between = style(t.betweenJustified)
	export const start = style(t.startJustified)
	export const end = style(t.endJustified)


}


function _(elt: HTMLElement, prop: string, value: string) {
	switch (value) {
		case 'around': value = 'space-around'; break
		case 'between': value = 'space-between'; break
		case 'start': value = 'flex-start'; break
		case 'end': value = 'flex-end'; break
		case 'no': value = 'nowrap'; break
	}

	var style: any = elt.style
	style[prop] = value
	style[`webkit${prop[0].toUpperCase() + prop.slice(1)}`] = value
}


function _parse_attributes(el: HTMLElement, at: FlexAttributes) {

	var cls = el.classList

	if (at.wrap != null) cls.add(CSS.wrap)
	if (at.direction != null) {
		if (!at.reverse)
			_(el, 'flexDirection', at.direction)
		else
			_(el, 'flexDirection', at.direction === 'column' ? 'column-reverse' : 'row-reverse')
	} else if (at.reverse != null) _(el, 'flexDirection', 'row-reverse')

	if (at.grow != null) _(el, 'flexGrow', at.grow)
	if (at.basis != null) _(el, 'flexBasis', at.basis)

	if (at.absoluteGrow != null) {
		_(el, 'flexGrow', at.absoluteGrow)
		_(el, 'flexBasis', '0')
	}

	if (at.align != null) {
		_(el, 'alignItems', at.align)
	}

	if (at.justify != null) {
		_(el, 'justifyContent', at.justify)
	}

}

export interface FlexAttributes extends Attrs {
	wrap?: string | boolean
	direction?: string
	align?: string
	reverse?: boolean
	grow?: string
	basis?: string
	justify?: string
	absoluteGrow?: string
}

export function Row(at: FlexAttributes, ch: DocumentFragment): Element {
	let node = e('div', {class: CSS.horizontal}, ch)
	_parse_attributes(node, at)
	return node
}

export function Column(at: FlexAttributes, ch: DocumentFragment): Element {
	at.direction = 'column'
	let node = e('div', {class: CSS.vertical}, ch)
	_parse_attributes(node, at)
	return node
}

export interface ChildAttributes extends FlexAttributes {
	// FIXME this should be specified differently
}

/**
 * A child that's not a flex itself (otherwise we'd use Row or Column), on which
 * there is hence no point in using the special align-items, ...
 */
export function Child(at: ChildAttributes, ch: DocumentFragment): Element {
	let node = e('div', null, ch)
	_parse_attributes(node, at)
	return node
}

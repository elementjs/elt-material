
import {Attrs} from 'elt'
import {Column} from './flex'


export function Card(a: Attrs, children: DocumentFragment): Element {
	var {$$children, class: kls, ...attrs} = a
	return <Column class='em-card-frame' {...attrs}>{children}</Column>
}

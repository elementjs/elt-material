
import {
	click,
	Component,
	Attrs
} from 'elt'

import {inkClickDelay} from './ink'

import {Icon} from './icon'
import {Column} from './flex'


import {animateClass} from './animate'


export interface NavAttributes extends Attrs {

}

export class Nav extends Component {

	node: HTMLElement

	detach() {
		animateClass(this.node, 'animation-leave').then(() => {
			this.node.remove()
		}).catch(e => {
			console.error(e)
		})
	}

	inserted(node: HTMLElement) {
		this.node = node
		animateClass(node, 'animation-enter')
	}

	removed() {
		this.node = null!
	}

	render(ch: DocumentFragment): Element {

		return <div class='em-nav-holder'>
			<div class='em-navigation-overlay' $$={[click((e, overlay) => {
				if (e.target === overlay)
					this.detach()
			})]}/>
			<Column class='em-navigation-drawer'>
				{ch}
			</Column>
		</div>
	}

}

export function NavHeader(a: Attrs, ch: DocumentFragment): Element {
	return <div class='em-navigation-header'>{ch}</div>
}

export function NavSubheader(a: Attrs, ch: DocumentFragment): Element {
	return <div class='em-navigation-subheader'>{ch}</div>
}

export function NavDivider(a: Attrs, ch: DocumentFragment): Element {
	return <div class='em-navigation-divider'/>
}

export interface NavItemAttributes extends Attrs {
	icon: string
	click?: (ev: MouseEvent) => any
}

export function NavItem(a: NavItemAttributes, ch: DocumentFragment): Element {
	let res = <div class='em-navigation-item' $$={[inkClickDelay(function (e) {
		if (a.click && a.click(e) !== false) {
			let c = Nav.get(res)
			// XXX should we log an error here if c was null ?
			if (c) c.detach()
		}
	})]}>
		<Icon class='em-navigation-item-icon' name={a.icon}/>
		{ch}
	</div>

	return res
}

export function NavBody(a: Attrs, ch: DocumentFragment): Element {
	return <div class='em-navigation-body'>{ch}</div>
}

export function NavFooter(a: Attrs, ch: DocumentFragment): Element {
	return <div class='em-navigation-footer'>{ch}</div>
}

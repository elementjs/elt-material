
//////////////////////////////////////////////////////////////
import {
	Attrs,
	bind,
	Component,
	o,
	on,
	MaybeObservable,
	Observable,
	Repeat,
	Display,
	Mixin
} from 'elt'


export type LabelFn<T> = (opt: T) => MaybeObservable<string>
// export type ChangeFn<T> = (value: T, event: Event, atom: Atom) => any
export type ChangeFn<T> = (value: T, ev?: Event) => any


export interface SelectAttributes<T> extends Attrs {
	model: Observable<T>
	options: MaybeObservable<T[]>
	labelfn?: LabelFn<T>
	onchange?: ChangeFn<T>
	placeholder?: MaybeObservable<string>
}

export class Select<T> extends Component {

	attrs: SelectAttributes<T>
	protected selected: Observable<string> = o('-1')

	/**
	 * Setup the observation logic.
	 */
	render(children: DocumentFragment): Element {
		let mod = false;

		let attrs = this.attrs

		let options = o(attrs.options)
		let {model, labelfn, onchange} = attrs

		// Used for typing, to avoid the undefined part.
		var real_labelfn = (obj: any) => {
			return obj.label || obj.text || obj
		}
		if (labelfn) real_labelfn = labelfn

		//  We use a touched() function to avoid infinite loops since there
		//  is a circular logic here.
		let touched = () => {
			if (mod)
				return true
			mod = true
			requestAnimationFrame(() => { mod = false; });
			return false
		}

		this.observe(options, (opts) => {
			if (touched()) return;

			this.selected.set('' + opts.indexOf(model.get()));

		});

		this.observe(model, (v) => {
			if (touched()) return;

			this.selected.set(''+ options.get().indexOf(v));
		});

		this.observe(this.selected, (v) => {
			if (touched()) return;
			model.set(options.get()[parseInt(v)]);
		});

		////////////////////////////////

		let decorators: Mixin[] = [bind(this.selected)];

		if (onchange) {
			var fn = onchange // used this for typing matters.
			decorators.push(on('change', ev => fn(model.get(), ev)))
		}

		return <label class={CSS.label}>
			<select class={CSS.select} $$={decorators}>
				{Repeat(options, (opt, i) => <option
						value={i}
						selected={model.equals(opt)}>
							{opt.tf(val => Display(real_labelfn(val)))}
					</option>
				)}
			</select>
		</label>
	}

}

import s from './styling'

export namespace CSS {
	export const select = s.style('select',
		s.values.NoSpuriousBorders,
		s.values.NoNativeAppearance,
		{
			padding: '0 16px 0 8px',
			height: '32px',
			margin: 0,
			border: `1px solid ${s.colors.FgFaint}`,
			borderRadius: '2px',
			background: s.colors.Bg,
			color: s.colors.FgLighter,
			display: 'inline-block',
			cursor: 'pointer'
		}
	)

	export const label = s.style('label',
		{position: 'relative'},
		s.after({
			content: "'\\f2f2'",
			font: '14px "Material-Design-Iconic-Font", monospace',
			color: s.colors.FgLighter,
			right: '8px',
			top: '9px',
			padding: '0 0 2px',
			position: 'absolute',
			pointerEvents: 'none',
			verticalAlign: 'middle'
		})
	)
}

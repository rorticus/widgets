import { tsx, create } from '@dojo/framework/core/vdom';
import * as css from '../theme/checkbox.m.css';
import coreTheme from '@dojo/framework/core/middleware/theme';
import focus from '@dojo/framework/core/middleware/focus';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedProperties } from '@dojo/framework/core/mixins/Themed';
import { FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Label from '../label/index';
import { formatAriaProperties } from '../common/util';
import { uuid } from '@dojo/framework/core/util';

export interface CheckboxProperties extends ThemedProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/**  Checked/unchecked property of the radio */
	checked?: boolean;
	disabled?: boolean;
	label?: string;
	labelAfter?: boolean;
	labelHidden?: boolean;
	name?: string;
	onBlur?(): void;
	onFocus?(): void;
	/** Label to show in the "on" positin of a toggle */
	onLabel?: DNode;
	onOut?(): void;
	onOver?(): void;
	onValue?(checked: boolean): void;
	readOnly?: boolean;
	required?: boolean;
	valid?: boolean;
	/** The current value */
	value?: string;
	widgetId?: string;
}

const factory = create({ coreTheme, focus }).properties<CheckboxProperties>();

export const Checkbox = factory(function Checkbox({
	properties,
	middleware: { coreTheme, focus }
}) {
	const _uuid = uuid();
	const {
		aria = {},
		checked = false,
		classes,
		disabled,
		label,
		labelAfter = true,
		labelHidden,
		name,
		onBlur,
		onFocus,
		onValue,
		onOut,
		onOver,
		readOnly,
		required,
		theme,
		valid,
		widgetId = _uuid
	} = properties();

	const themeCss = coreTheme.classes(css);

	const getRootClasses = () => [
		themeCss.root,
		checked ? themeCss.checked : null,
		disabled ? themeCss.disabled : null,
		focus.isFocused('root') ? themeCss.focused : null,
		valid === false ? themeCss.invalid : null,
		valid === true ? themeCss.valid : null,
		readOnly ? themeCss.readonly : null,
		required ? themeCss.required : null
	];

	const children = [
		<div classes={themeCss.inputWrapper}>
			<input
				id={widgetId}
				{...formatAriaProperties(aria)}
				classes={themeCss.input}
				checked={checked}
				disabled={disabled}
				focus={focus.shouldFocus}
				aria-invalid={valid === false ? 'true' : null}
				name={name}
				readonly={readOnly}
				aria-readonly={readOnly === true ? 'true' : null}
				required={required}
				type="checkbox"
				onblur={() => onBlur && onBlur()}
				onchange={(event: Event) => {
					event.stopPropagation();
					const checkbox = event.target as HTMLInputElement;
					onValue && onValue(checkbox.checked);
				}}
				onfocus={() => onFocus && onFocus()}
				onpointerenter={() => onOver && onOver()}
				onpointerleave={() => onOut && onOut()}
			/>
		</div>,
		label && (
			<Label
				key="label"
				classes={classes}
				theme={theme}
				disabled={disabled}
				focused={focus.isFocused('root')}
				valid={valid}
				readOnly={readOnly}
				required={required}
				hidden={labelHidden}
				forId={widgetId}
				secondary={true}
			>
				{label}
			</Label>
		)
	];

	return (
		<div key="root" classes={getRootClasses()}>
			{labelAfter ? children : children.reverse()}
		</div>
	);
});

export default Checkbox;

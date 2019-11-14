import { tsx, create } from '@dojo/framework/core/vdom';
import * as css from '../theme/checkbox.m.css';
import coreTheme from '@dojo/framework/core/middleware/theme';
import focus from '@dojo/framework/core/middleware/focus';
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
	/** Whether the Checkbox is disabled */
	disabled?: boolean;
	/** The label to apply to the Checkbox. If defined, the component creates a Label component to display this value */
	label?: string;
	/** Whether the label should be hidden */
	labelHidden?: boolean;
	/** The name property to apply to the Checkbox input element */
	name?: string;
	/** Handler for events triggered by Checkbox losing focus */
	onBlur?(): void;
	/** Handler for events triggered by "on focus" */
	onFocus?(): void;
	/** Handler for events triggered by "on out" */
	onOut?(): void;
	/** Handler for events triggered by "on over" */
	onOver?(): void;
	/** Handler for events triggered when the Checkbox checked state changes */
	onValue?(checked: boolean): void;
	/** Whether the Checkbox is readonly */
	readOnly?: boolean;
	/** Whether the Checkbox is required */
	required?: boolean;
	/** Whether the Checkbox is in a valid, invalid, or neither state */
	valid?: boolean;
	/** The current Checkbox value, applied to the input node */
	value?: string;
	/** `id` set on the checkbox input node */
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
		value,
		widgetId = _uuid
	} = properties();

	const themeCss = coreTheme.classes(css);

	return (
		<div
			key="root"
			classes={[
				themeCss.root,
				checked ? themeCss.checked : null,
				disabled ? themeCss.disabled : null,
				focus.isFocused('root') ? themeCss.focused : null,
				valid === false ? themeCss.invalid : null,
				valid === true ? themeCss.valid : null,
				readOnly ? themeCss.readonly : null,
				required ? themeCss.required : null
			]}
		>
			<div classes={themeCss.inputWrapper}>
				<input
					id={widgetId}
					{...formatAriaProperties(aria)}
					classes={themeCss.input}
					checked={checked}
					disabled={disabled}
					focus={focus.shouldFocus()}
					aria-invalid={valid === false ? 'true' : null}
					name={name}
					readonly={readOnly}
					aria-readonly={readOnly === true ? 'true' : null}
					required={required}
					type="checkbox"
					value={value}
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
				<div classes={themeCss.background}>
					<svg classes={themeCss.checkmark} viewBox="0 0 24 24">
						<path
							classes={themeCss.checkmarkPath}
							fill="none"
							d="M1.73,12.91 8.1,19.28 22.79,4.59"
						/>
					</svg>
				</div>
			</div>
			{label && (
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
			)}
		</div>
	);
});

export default Checkbox;

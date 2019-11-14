const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { tsx, create } from '@dojo/framework/core/vdom';
import * as sinon from 'sinon';
import harness from '@dojo/framework/testing/harness';

import Label from '../../../label/index';
import Checkbox from '../../index';
import * as css from '../../../theme/checkbox.m.css';
import { noop, stubEvent } from '../../../common/tests/support/test-helpers';
import focus from '@dojo/framework/core/middleware/focus';

const compareId = {
	selector: 'input',
	property: 'id',
	comparator: (property: any) => typeof property === 'string'
};
const compareForId = {
	selector: '@label',
	property: 'forId',
	comparator: (property: any) => typeof property === 'string'
};

const middlewareFactory = create();
function createMockFocusMiddleware({
	shouldFocus = false,
	focused = false,
	isFocused = false
} = {}) {
	return () =>
		middlewareFactory(() => ({
			shouldFocus: () => shouldFocus,
			focused: () => focused,
			isFocused: () => isFocused
		}))();
}

const expected = function(label = false, checked = false) {
	return (
		<div
			key="root"
			classes={[css.root, checked ? css.checked : null, null, null, null, null, null, null]}
		>
			<div classes={css.inputWrapper}>
				<input
					id=""
					classes={css.input}
					checked={checked}
					disabled={undefined}
					focus={false}
					aria-invalid={null}
					name={undefined}
					readonly={undefined}
					aria-readonly={null}
					required={undefined}
					type="checkbox"
					value={undefined}
					onblur={noop}
					onchange={noop}
					onfocus={noop}
					onpointerenter={noop}
					onpointerleave={noop}
				/>
				<div classes={css.background}>
					<svg classes={css.checkmark} viewBox="0 0 24 24">
						<path
							classes={css.checkmarkPath}
							fill="none"
							d="M1.73,12.91 8.1,19.28 22.79,4.59"
						/>
					</svg>
				</div>
			</div>
			{label ? (
				<Label
					key="label"
					theme={undefined}
					classes={undefined}
					disabled={undefined}
					focused={false}
					hidden={undefined}
					valid={undefined}
					readOnly={undefined}
					required={undefined}
					forId=""
					secondary={true}
				>
					foo
				</Label>
			) : null}
		</div>
	);
};

registerSuite('Checkbox', {
	tests: {
		'default properties'() {
			const h = harness(() => <Checkbox />, [compareId]);
			h.expect(() => expected());
		},

		'custom properties'() {
			const h = harness(
				() => (
					<Checkbox
						aria={{ describedBy: 'foo' }}
						checked={true}
						widgetId="foo"
						name="bar"
					/>
				),
				[compareId]
			);

			h.expect(() => (
				<div
					key="root"
					classes={[css.root, css.checked, null, null, null, null, null, null]}
				>
					<div classes={css.inputWrapper}>
						<input
							id=""
							aria-describedby="foo"
							name="bar"
							classes={css.input}
							checked={true}
							disabled={undefined}
							focus={false}
							aria-invalid={null}
							readonly={undefined}
							aria-readonly={null}
							required={undefined}
							type="checkbox"
							value={undefined}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							onpointerenter={noop}
							onpointerleave={noop}
						/>
						<div classes={css.background}>
							<svg classes={css.checkmark} viewBox="0 0 24 24">
								<path
									classes={css.checkmarkPath}
									fill="none"
									d="M1.73,12.91 8.1,19.28 22.79,4.59"
								/>
							</svg>
						</div>
					</div>
				</div>
			));
		},

		label() {
			const h = harness(() => <Checkbox label="foo" />, [compareId, compareForId]);

			h.expect(() => expected(true));
		},

		'state classes'() {
			let valid = false;
			let disabled = true;
			let readOnly = true;
			let required = true;
			const h = harness(
				() => (
					<Checkbox
						valid={valid}
						disabled={disabled}
						readOnly={readOnly}
						required={required}
					/>
				),
				[compareForId, compareId]
			);

			h.expect(() => (
				<div
					key="root"
					classes={[
						css.root,
						null,
						css.disabled,
						null,
						css.invalid,
						null,
						css.readonly,
						css.required
					]}
				>
					<div classes={css.inputWrapper}>
						<input
							id=""
							classes={css.input}
							checked={false}
							focus={false}
							aria-invalid="true"
							aria-readonly="true"
							type="checkbox"
							value={undefined}
							name={undefined}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							disabled={true}
							readonly={true}
							required={true}
							onpointerenter={noop}
							onpointerleave={noop}
						/>
						<div classes={css.background}>
							<svg classes={css.checkmark} viewBox="0 0 24 24">
								<path
									classes={css.checkmarkPath}
									fill="none"
									d="M1.73,12.91 8.1,19.28 22.79,4.59"
								/>
							</svg>
						</div>
					</div>
				</div>
			));

			valid = true;
			disabled = false;
			readOnly = false;
			required = false;

			h.expect(() => (
				<div key="root" classes={[css.root, null, null, null, null, css.valid, null, null]}>
					<div classes={css.inputWrapper}>
						<input
							id=""
							classes={css.input}
							checked={false}
							focus={false}
							aria-invalid={null}
							aria-readonly={null}
							type="checkbox"
							value={undefined}
							name={undefined}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							disabled={false}
							readonly={false}
							required={false}
							onpointerenter={noop}
							onpointerleave={noop}
						/>
						<div classes={css.background}>
							<svg classes={css.checkmark} viewBox="0 0 24 24">
								<path
									classes={css.checkmarkPath}
									fill="none"
									d="M1.73,12.91 8.1,19.28 22.79,4.59"
								/>
							</svg>
						</div>
					</div>
				</div>
			));
		},

		'state properties on label'() {
			const h = harness(
				() => (
					<Checkbox
						label="foo"
						valid={false}
						disabled={true}
						readOnly={true}
						required={true}
					/>
				),
				[compareId, compareForId]
			);

			h.expect(() => (
				<div
					key="root"
					classes={[
						css.root,
						null,
						css.disabled,
						null,
						css.invalid,
						null,
						css.readonly,
						css.required
					]}
				>
					<div classes={css.inputWrapper}>
						<input
							disabled={true}
							classes={css.input}
							focus={false}
							aria-invalid="true"
							readonly={true}
							aria-readonly="true"
							required={true}
							checked={false}
							name={undefined}
							type="checkbox"
							value={undefined}
							id=""
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							onpointerenter={noop}
							onpointerleave={noop}
						/>
						<div classes={css.background}>
							<svg classes={css.checkmark} viewBox="0 0 24 24">
								<path
									classes={css.checkmarkPath}
									fill="none"
									d="M1.73,12.91 8.1,19.28 22.79,4.59"
								/>
							</svg>
						</div>
					</div>
					<Label
						key="label"
						disabled={true}
						focused={false}
						theme={undefined}
						classes={undefined}
						readOnly={true}
						required={true}
						valid={false}
						hidden={undefined}
						forId=""
						secondary={true}
					>
						foo
					</Label>
				</div>
			));
		},

		'focused class'() {
			const focusMock = createMockFocusMiddleware({
				shouldFocus: true,
				focused: true,
				isFocused: true
			});
			const h = harness(() => <Checkbox />, {
				middleware: [[focus, focusMock]],
				customComparator: [compareId]
			});
			h.expect(() => (
				<div
					key="root"
					classes={[css.root, null, null, css.focused, null, null, null, null]}
				>
					<div classes={css.inputWrapper}>
						<input
							id=""
							classes={css.input}
							checked={false}
							disabled={undefined}
							focus={true}
							aria-invalid={null}
							name={undefined}
							readonly={undefined}
							aria-readonly={null}
							required={undefined}
							type="checkbox"
							value={undefined}
							onblur={noop}
							onchange={noop}
							onfocus={noop}
							onpointerenter={noop}
							onpointerleave={noop}
						/>
						<div classes={css.background}>
							<svg classes={css.checkmark} viewBox="0 0 24 24">
								<path
									classes={css.checkmarkPath}
									fill="none"
									d="M1.73,12.91 8.1,19.28 22.79,4.59"
								/>
							</svg>
						</div>
					</div>
				</div>
			));
		},

		events() {
			const onBlur = sinon.stub();
			const onValue = sinon.stub();
			const onFocus = sinon.stub();

			const h = harness(() => (
				<Checkbox onBlur={onBlur} onValue={onValue} onFocus={onFocus} />
			));

			h.trigger('input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('input', 'onchange', stubEvent);
			assert.isTrue(onValue.called, 'onChange called');
			h.trigger('input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');
		}
	}
});

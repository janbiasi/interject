import * as React from 'react';
import { shallow, render } from 'enzyme';
import { Module, InjectionToken } from '@interject/core';
import { withInterject } from '../src/withInterject';

const TEST_TOKEN = new InjectionToken<string>('a test token');

describe('withInterject', () => {
	it('should render a react component', () => {
		const Stub = () => <p>react-stub-noop</p>;
		const EnhancedStub = withInterject(Stub);

		expect(shallow(<Stub />)).toMatchSnapshot();
		expect(shallow(<EnhancedStub />)).toMatchSnapshot();
	});

	it('should inject an empty module into a react component', () => {
		@Module()
		class MyModule {
			public static provideAs = 'MyModule';
		}

		const Component = () => <p>MyComponent</p>;
		const MyComponent = withInterject(Component, MyModule);

		expect(shallow(<MyComponent />)).toMatchSnapshot();
	});

	it('should inject a module with providers into a react component', () => {
		@Module({
			providers: [{ provide: TEST_TOKEN, useValue: 'test' }],
		})
		class MyModule {
			public provideAs = 'MyModule';
			public value: string;

			constructor(value: string) {
				this.value = value;
			}
		}

		const Component = ({ MyModule }: { MyModule: MyModule }) => {
			return <p>Value is {MyModule.value}</p>;
		};
		const MyComponent = withInterject(Component, MyModule);

		expect(shallow(<MyComponent />)).toMatchSnapshot();
		expect(render(<MyComponent />)).toMatchSnapshot();
	});

	it('should inject a module as singleton into a react component using persistant state', () => {
		@Module({
			providers: [{ provide: TEST_TOKEN, useValue: 'test' }],
		})
		class MyModule {
			static creationCount: number = 0;
			public provideAs = 'MyModule';
			public value: string;

			constructor(value: string) {
				MyModule.creationCount++;
				this.value = value;
			}
		}

		const ComponentA = ({ MyModule }: { MyModule: MyModule }) => <p>A: {MyModule.value}</p>;
		const ComponentB = ({ MyModule }: { MyModule: MyModule }) => <p>A: {MyModule.value}</p>;
		const A = withInterject(ComponentA, MyModule);
		const B = withInterject(ComponentB, MyModule);

		expect(shallow(<A />)).toMatchSnapshot();
		expect(shallow(<B />)).toMatchSnapshot();
		expect(render(<A />)).toMatchSnapshot();
		expect(render(<B />)).toMatchSnapshot();
		expect(MyModule.creationCount).toEqual(1);
	});
});

import React from "react";
import { initializeReactContainer, render, element, form, field, click, submit, submitButton, change, labelFor  } from "./reactTestExtensions";
import { CustomerForm } from '../src/CustomerForm'


describe('CustomerForm', () => {
    beforeEach(() => {
        initializeReactContainer();
    });

    const blankCustomer = { 
        firstName: "",
        lastName: "", 
        phoneNumber: "",
    };

    const spy = () => {
        let receivedArguments;
        return {
            fn: (...args) => (receivedArguments = args),
            receivedArguments: () => receivedArguments,
            receivedArgument: n => receivedArguments[n]
        };
    }

    it('renders a form', () => {
        render(<CustomerForm original={blankCustomer}/>);
        expect(form()).not.toBeNull();
    });

    const itRendersAsATextBox = (fieldName) => 
        it('renders as text box', () => {
            render(<CustomerForm original={blankCustomer}/>);
            expect(field(fieldName)).toBeInputFieldOfType('text');
    });    
        
    const itIncludesTheExistingValue = (fieldName, existing) => 
        it('includes the existing value', () => {
            const customer = { [fieldName]: existing };
            render(<CustomerForm original={customer} />);
            expect(field(fieldName).value).toEqual(existing);
    });

    const itRendersLabel = (fieldName, labelText) => {
        it('renders a label for the text box', () => {
            render(<CustomerForm original={blankCustomer} />);
            expect(labelFor(fieldName)).not.toBeNull();
        }); 

        it('renders a label text as the label content', () => {
            render(<CustomerForm original={blankCustomer} />);
            expect(labelFor(fieldName)).toContainText(labelText);
        });
    
    };

    const itAssignesIdMatchingLabelId = (fieldName) => it('assigns an id that matches the label id', () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(field(fieldName).id).toEqual(fieldName);

    });

    const itSubmitsExistingValue = (fieldName, value) => it('saves existing value when submitted', () => {
        const submitSpy = spy();
        const customer = { [fieldName]: value };
        render(
            <CustomerForm 
                original={customer} 
                onSubmit={submitSpy.fn} />
        );
        click(submitButton());
        expect(submitSpy).toBeCalledWith(customer);
    });

    const itSavesNewValueWhenSubmitted = (fieldName, value) => it('saves new value when submitted', () => {
        expect.hasAssertions();
        render(
            <CustomerForm
                original={blankCustomer}
                onSubmit={( props ) => expect(props[fieldName]).toEqual(value)}
            />
        );
        change(field(fieldName), value);
        click(submitButton());
    });


    describe('first name field', () => {
        itRendersAsATextBox('firstName');
        itIncludesTheExistingValue('firstName', 'Ashley');
        itRendersLabel('firstName', 'First name');
        itAssignesIdMatchingLabelId('firstName');
        itSubmitsExistingValue('firstName', 'Ashley');
        itSavesNewValueWhenSubmitted('firstName', 'Jamie');
    });

    describe('last name field', () => {
        itRendersAsATextBox('lastName');
        itIncludesTheExistingValue('lastName', 'Smith');
        itRendersLabel('lastName', 'Last name');
        itAssignesIdMatchingLabelId('lastName');
        itSubmitsExistingValue('lastName', 'Smith');
        itSavesNewValueWhenSubmitted('lastName', 'Test2');
    });

    describe('phone number field', () => {
        itRendersAsATextBox('phoneNumber');
        itIncludesTheExistingValue('phoneNumber', '1234567890');
        itRendersLabel('phoneNumber', 'Phone number');
        itAssignesIdMatchingLabelId('phoneNumber');
        itSubmitsExistingValue('phoneNumber', '1234567890');
        itSavesNewValueWhenSubmitted('phoneNumber', '0987654321');
    });

    it('renders a submit button', () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(submitButton()).not.toBeNull();
    });

    it('prevents the default action when sumitting the form', () => {
        render(<CustomerForm original={blankCustomer} onSubmit={() => {}} />);
        const event = submit(form());
        expect(event.defaultPrevented).toBe(true);
    });
});
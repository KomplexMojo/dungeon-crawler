// test/GameItemDefinitions.test.js
import { createGameItemDefinition, __newString, __getString} from "../build/debug.js"; // Ensure correct path and extension

describe('GameItemDefinitions', function() {

    /**
     * Helper function to call the createGameItemDefinition exported function.
     * @param {string} jsonStr - The JSON string to parse.
     * @returns {object} - The parsed Result object.
     */
    function createGameItemDefinition(jsonStr) {
        // Allocate memory for the JSON string
        const jsonPtr = __newString(jsonStr, true);
        
        // Call the exported function
        const resultPtr = createGameItemDefinition(jsonPtr);
        
        // Retrieve the Result JSON string from memory
        const resultStr = __getString(resultPtr);
        
        // Parse the Result JSON string into a JavaScript object
        return JSON.parse(resultStr);
    }

    it('should create an AppearanceDefinition from valid JSON', function() {
        const jsonStr = JSON.stringify({
            index: 5,
            name: "Appearance Item",
            description: "A test appearance item.",
            defaults: {
                required: true,
                growth: "fixed"
            },
            visualization: [
                [true, false, true],
                [false, true, false],
                [true, true, true]
            ],
            properties: []
        });

        const result = createGameItemDefinition(jsonStr);
        expect(result.value).to.have.property('index', 5);
        expect(result.value).to.have.property('name', "Appearance Item");
        expect(result.value).to.have.property('description', "A test appearance item.");
        expect(result.value).to.have.property('defaults');
        expect(result.value.defaults).to.deep.equal({
            required: true,
            growth: "fixed"
        });
        expect(result.value).to.have.property('visualization');
        expect(result.value.visualization).to.deep.equal([
            [true, false, true],
            [false, true, false],
            [true, true, true]
        ]);
    });

    it('should return an error for missing index field', function() {
        const jsonStr = JSON.stringify({
            name: "Missing Index Item",
            description: "An item without an index.",
            defaults: {
                required: false,
                growth: "variable"
            },
            visualization: [
                [false, false],
                [true, true]
            ]
        });

        const result = createGameItemDefinition(jsonStr);
        expect(result).to.have.property('isOk', false);
        expect(result).to.have.property('error').that.includes("Key 'index' is missing");
    });

    it('should return an error for invalid growth type', function() {
        const jsonStr = JSON.stringify({
            index: 150,
            name: "Invalid Growth Item",
            description: "An item with an invalid growth type.",
            defaults: {
                required: true,
                growth: "unknown"
            },
            properties: []
            // No visualization for CharacteristicDefinition
        });

        const result = createGameItemDefinition(jsonStr);
        expect(result).to.have.property('isOk', false);
        expect(result).to.have.property('error').that.includes("Invalid 'growth' value");
    });

    it('should create a BehaviourDefinition from valid JSON', function() {
        const jsonStr = JSON.stringify({
            index: 250,
            name: "Behaviour Item",
            description: "A test behaviour item.",
            defaults: {
                required: false,
                growth: "variable"
            },
            properties: []
            // No visualization for BehaviourDefinition
        });

        const result = createGameItemDefinition(jsonStr);
        expect(result).to.have.property('isOk', true);
        expect(result).to.have.property('value');
        expect(result.value).to.have.property('index', 250);
        expect(result.value).to.have.property('name', "Behaviour Item");
        expect(result.value).to.have.property('description', "A test behaviour item.");
        expect(result.value).to.have.property('defaults');
        expect(result.value.defaults).to.deep.equal({
            required: false,
            growth: "variable"
        });
        expect(result.value).to.not.have.property('visualization');
    });

    it('should return an error for invalid visualization structure', function() {
        const jsonStr = JSON.stringify({
            index: 5,
            name: "Invalid Visualization Item",
            description: "An item with invalid visualization.",
            defaults: {
                required: true,
                growth: "fixed"
            },
            visualization: [
                [true, "false", true], // Invalid: "false" as string instead of boolean
                [false, true, false],
                [true, true, true]
            ],
            properties: []
        });

        const result = createGameItemDefinition(jsonStr);
        expect(result).to.have.property('isOk', false);
        expect(result).to.have.property('error').that.includes("is not a boolean");
    });

    // Add more test cases as needed
});
var AC;
(function() {
    "use strict";
    // Usage: var myCompleter = new AC(options);
    // All options are required:
    // inputDomNode: a DOM node reference - should probably be a text field
    // completionsDomNode: node to render competions in
    // inputList: data to filter for completions, as an array
    // limit: number of completions that will be shown at a time
    // unselectedClassName: completions that are not selected are rendered with this CSS class
    // selectedClassName: and this one is for the selected completion
    AC = function(inputDomNode, completionsDomNode, inputList, limit, unselectedClassName, selectedClassName) {
        var completions = []; // Current completions found and rendered
        var selectedIndex = 0; // Currently selected item

        // Return checkList filtered by inputValue, with a limit of outputLimit values
        var getCompletions = function(inputValue, checkList, outputLimit) {
            if (inputValue.length === 0) { // Empty input gives empty completions
                return [];
            }

            // For case insensitivity
            var searchString = String(inputValue).toLowerCase();

            return checkList.filter(function(item) {
                return String(item).toLowerCase().includes(searchString);
            }).slice(0, outputLimit);
        };

        // Trigger to update the completionsDomNode with new values
        var updateCompletions = function() {
            completions = getCompletions(
                inputDomNode.value,
                inputList,
                limit
            );

            // Clip the selected index to within the bounds of completions
            selectedIndex = Math.max(Math.min(selectedIndex, completions.length - 1), 0);

            // Render the completions
            var renderSelectors = completions.map(function(completion, index) {
                var className = (index === selectedIndex) ? selectedClassName : unselectedClassName;
                return "<div class='" + className + "'>" + completion + "</div>";
            });

            completionsDomNode.innerHTML = renderSelectors.join("");
        };

        // Take the selected item and fill it into the input node
        var fillField = function() {
            var completionToFill = completions[selectedIndex];
            inputDomNode.value = completionToFill;
        };

        // Attach a handler to the input node for updating completions and selection
        var keyUp = function(event) {
            // Check for special keys
            switch (event.keyCode) {
                case 38: // Up
                    event.preventDefault();
                    selectedIndex--;
                    break;
                case 40: // Down
                    event.preventDefault();
                    selectedIndex++;
                    break;
                case 13: // Enter
                    event.preventDefault();
                    fillField();
            }
            // Update and render the changes
            updateCompletions();
        };
        inputDomNode.addEventListener("keyup", keyUp);
    };
})();

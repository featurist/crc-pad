((function() {
    var self, exports, crcCardMarkup, padMarkup, plusMarkup, updateInTo, updateOptionsWithTo, updateWhenChange, ids, makeIntoCrcCard, makeDraggable, makeUndraggable, makeSelectable, destroyIfSure, makeDestroyable, addAPadElementTo, addAPlusButtonTo;
    self = this;
    exports = exports || this;
    crcCardMarkup = "\n  <div class='crc-card'>\n    <div class='show'>\n      <h1 data-field='title'></h1>\n\n      <div class='responsibilities'>\n        <h2>Responsibilities</h2>\n        <p data-field='responsibility-0'></p>\n        <p data-field='responsibility-1'></p>\n        <p data-field='responsibility-2'></p>\n        <p data-field='responsibility-3'></p>\n      </div>\n\n      <div class='collaborators'>\n        <h2>Collaborators</h2>\n        <p data-field='collaborator-0'></p>\n        <p data-field='collaborator-1'></p>\n        <p data-field='collaborator-2'></p>\n        <p data-field='collaborator-3'></p>\n      </div>\n      \n      <a href='#edit' class='edit-button'>edit</a>\n    </div>\n\n    <div class='edit'>\n      <input type='text' data-field='title' value='' class='title-input' placeholder='class name'></input>\n\n      <div class='responsibilities'>\n        <h2>Responsibilities</h2>\n        <input type='text' data-field='responsibility-0' value='' name='responsibility_0'></input>\n        <input type='text' data-field='responsibility-1' value='' name='responsibility_1'></input>\n        <input type='text' data-field='responsibility-2' value='' name='responsibility_2'></input>\n        <input type='text' data-field='responsibility-3' value='' name='responsibility_3'></input>\n      </div>\n\n      <div class='collaborators'>\n        <h2>Collaborators</h2>\n        <select data-field='collaborator-0' name='responsibility_0'><option></option></select>\n        <select data-field='collaborator-1' name='responsibility_1'><option></option></select>\n        <select data-field='collaborator-2' name='responsibility_2'><option></option></select>\n        <select data-field='collaborator-3' name='responsibility_3'><option></option></select>\n      </div>\n      \n      <a href='#view' class='view-button'>done</a>\n    </div>\n  </div>\n  ";
    padMarkup = "<div class='pad'><a class='destroy' href='#destroy'>X</a></div>";
    plusMarkup = "<a class='plus' href='#plus'>+</a>";
    updateInTo = function(field, view, value) {
        return view.find(".show [data-field='" + field + "']").html(value);
    };
    updateOptionsWithTo = function(id, value) {
        return $("option[value='" + id + "']:selected").each(function() {
            var pad, field;
            pad = $(this).parents(".pad").first();
            field = $(this).parents("select").data("field");
            updateInTo(field, pad, value);
            return true;
        });
    };
    updateWhenChange = function(view, fields) {
        fields.filter("select").change(function() {
            var field, value;
            field = $(this).data("field");
            value = $(this).find("option:selected").text();
            updateInTo(field, view, value);
            return false;
        });
        fields.filter(".title-input").keyup(function() {
            var select, field, value, id;
            select = $(this);
            field = select.data("field");
            value = select.val();
            updateInTo(field, view, value);
            id = view.attr("id");
            $("option[value='" + id + "']").html(value);
            updateOptionsWithTo(id, value);
            return true;
        });
        return fields.filter("input").keyup(function() {
            var field, value;
            field = $(this).data("field");
            value = $(this).val();
            updateInTo(field, view, value);
            return false;
        });
    };
    ids = {
        counter: 0,
        next: function() {
            var self;
            self = this;
            self.counter = self.counter + 1;
            return "card-" + self.counter;
        }
    };
    makeIntoCrcCard = function(element) {
        var id, fields;
        id = ids.next();
        element.attr("id", id);
        $(crcCardMarkup).appendTo(element);
        fields = element.find("input, select");
        updateWhenChange(element, fields);
        fields.filter("select").html($("select:first").html());
        $("select").append("<option value='" + id + "'></option>");
        makeSelectable(element);
        return element;
    };
    makeDraggable = function(pad) {
        var options;
        options = {
            disabled: false
        };
        return pad.draggable(options);
    };
    makeUndraggable = function(pad) {
        var options;
        options = {
            disabled: true
        };
        return pad.draggable(options);
    };
    makeSelectable = function(pad) {
        pad.find(".edit-button").click(function() {
            makeUndraggable(pad);
            pad.addClass("selected");
            return false;
        });
        return pad.find(".view-button").click(function() {
            makeDraggable(pad);
            pad.removeClass("selected");
            return false;
        });
    };
    destroyIfSure = function(element) {
        var sure;
        sure = confirm("Are you sure?");
        if (sure) {
            var id;
            id = element.id;
            $("option[value='" + id + "']").remove();
            return element.remove();
        }
    };
    makeDestroyable = function(pad) {
        return pad.find(".destroy").click(function() {
            destroyIfSure(pad);
            return false;
        });
    };
    addAPadElementTo = function(element) {
        var pad;
        pad = $(padMarkup).appendTo(element);
        makeDestroyable(pad);
        makeDraggable(pad);
        return pad;
    };
    addAPlusButtonTo = function(element) {
        var plus;
        plus = $(plusMarkup).appendTo(element);
        return plus.click(function() {
            var pad;
            pad = addAPadElementTo(element);
            makeIntoCrcCard(pad);
            return false;
        });
    };
    exports.turnIntoPad = function(element) {
        var self;
        self = this;
        return addAPlusButtonTo(element);
    };
})).call(this);
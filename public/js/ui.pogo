exports = (exports || this)

crc card markup = "
  <div class='crc-card'>
    <div class='show'>
      <h1 data-field='title'></h1>

      <div class='responsibilities'>
        <h2>Responsibilities</h2>
        <p data-field='responsibility-0'></p>
        <p data-field='responsibility-1'></p>
        <p data-field='responsibility-2'></p>
        <p data-field='responsibility-3'></p>
      </div>

      <div class='collaborators'>
        <h2>Collaborators</h2>
        <p data-field='collaborator-0'></p>
        <p data-field='collaborator-1'></p>
        <p data-field='collaborator-2'></p>
        <p data-field='collaborator-3'></p>
      </div>
      
      <a href='#edit' class='edit-button'>edit</a>
    </div>

    <div class='edit'>
      <input type='text' data-field='title' value='' class='title-input' placeholder='class name'></input>

      <div class='responsibilities'>
        <h2>Responsibilities</h2>
        <input type='text' data-field='responsibility-0' value='' name='responsibility_0'></input>
        <input type='text' data-field='responsibility-1' value='' name='responsibility_1'></input>
        <input type='text' data-field='responsibility-2' value='' name='responsibility_2'></input>
        <input type='text' data-field='responsibility-3' value='' name='responsibility_3'></input>
      </div>

      <div class='collaborators'>
        <h2>Collaborators</h2>
        <select data-field='collaborator-0' name='responsibility_0'><option></option></select>
        <select data-field='collaborator-1' name='responsibility_1'><option></option></select>
        <select data-field='collaborator-2' name='responsibility_2'><option></option></select>
        <select data-field='collaborator-3' name='responsibility_3'><option></option></select>
      </div>
      
      <a href='#view' class='view-button'>done</a>
    </div>
  </div>
  "

pad markup = "<div class='pad'><a class='destroy' href='#destroy'>X</a></div>"
plus markup = "<a class='plus' href='#plus'>+</a>"

update @field in @view to @value =
  @view : find ".show [data-field='@field']" : html @value

update options with @id to @value =
  $ "option[value='@id']:selected" : each
    pad = $(this) : parents ".pad" : first!
    field = $(this) : parents "select" : data "field"
    update @field in @pad to @value
    true

update @view when @fields change =

  @fields : filter "select" : change
    field = $(this) : data "field"
    value = $(this) : find "option:selected" : text!
    update @field in @view to @value
    false

  @fields : filter ".title-input" : keyup
    select = $(this)
    field = @select : data "field"
    value = @select : val!
    update @field in @view to @value
    id = @view : attr "id"
    $ "option[value='@id']" : html @value
    update options with @id to @value
    true

  @fields : filter "input" : keyup
    field = $(this) : data "field"
    value = $(this) : val!
    update @field in @view to @value
    false

ids = {
  counter = 0
  next! =
    :counter = :counter + 1
    "card-@(:counter)"
}

make @element into crc card =
  id = @ids : next!
  @element : attr "id" @id
  $(crc card markup) : append to @element
  fields = @element : find "input, select"
  update @element when @fields change
  @fields : filter "select" : html ($ "select:first" : html!)
  $ "select" : append "<option value='@id'></option>"
  
  make @element selectable
  
  @element

make @pad draggable =
  options = {
    disabled = false
  }
  @pad: draggable @options


make @pad undraggable =
  options = {
    disabled = true
  }
  @pad: draggable @options

make @pad selectable =
  pad: find '.edit-button': click
    make @pad undraggable
    @pad: add class 'selected'
    false
  
  pad: find '.view-button': click
    make @pad draggable
    @pad: remove class 'selected'
    false

destroy @element if sure =
  sure = @confirm "Are you sure?"
  if (@sure)
    id = element : id
    $ "option[value='@id']" : remove!
    @element : remove!

make @pad destroyable =
  @pad : find ".destroy" : click
    destroy @pad if sure
    
    false

add a pad element to @element =
  pad = $(pad markup) : append to @element
  make @pad destroyable
  make @pad draggable
  @pad

add a plus button to @element =
  plus = $(plus markup) : append to @element
  @plus : click
    pad = add a pad element to @element
    make @pad into crc card
    
    false

exports:turn @element into pad =
  add a plus button to @element
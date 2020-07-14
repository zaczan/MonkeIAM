
$.fn.dataTable.ext.buttons.editRefresh = {
	extend: 'edit',
	text: 'Edit',
	action: function (e, dt, node, config) {
		this.processing( true );

		// Get currently selected row ids
		var selectedRows = dt.rows({selected:true}).ids();
		var that = this;

		// Ajax request to refresh the data for those ids
		$.ajax( {
			url: config.editor.ajax(),
			type: 'post',
			dataType: 'json',
			data: {
				refresh: 'rows',
				ids: selectedRows.toArray().join(',')
			},
			success: function ( json ) {
				// Update the rows we get data back for
				for ( var i=0 ; i<json.data.length ; i++ ) {
					dt.row( '#'+json.data[i].DT_RowId ).data( json.data[i] );
				}
				dt.draw(false);

				// Trigger the original edit button's action
				$.fn.dataTable.ext.buttons.edit.action.call(that, e, dt, node, config);
			}
		} );
	}
};


// Demo initialisation
$(document).ready(function() {
	var editor = new $.fn.dataTable.Editor( {
		ajax: "/bitacora",
		table: "#logs",
		fields: [ {
				label: "Id:",
				name: "id"
			}, {
				label: "Username:",
				name: "username"
			}, {
				label: "name:",
				name: "name"
			}, {
				label: "Area:",
				name: "area"
			}, {
				label: "Fecha:",
				name: "fecha",
				type: "datetime"
			}, {
				label: "Activo:",
				name: "activo",
				type: "boolean"
			}
		]
	} );

	$('#myTable').DataTable( {
		dom: "Bfrtip",
		pagingType: 'simple',
		ajax: "/bitacora",
		columns: [
			{ data: "id"},
			{data: "username"},
			{data: "name"},
			{data: "area"},
			{data: "fecha"},
			{data: "activo"}
			//{ data: null, render: function ( data, type, row ) {
			//	// Combine the first and last names into a single table field
			//	return data.first_name+' '+data.last_name;
			//} },
			//{ data: "position" },
			//{ data: "office" },
			//{ data: "salary", render: $.fn.dataTable.render.number( ',', '.', 0, '$' ) }
		],
		select: true,
		buttons: [
			{ extend: 'create', editor: editor },
			{ extend: 'editRefresh', editor: editor },
			{ extend: 'remove', editor: editor }
		]
	} );
} );

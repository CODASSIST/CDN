// Initialize pagination
$('.search-input').on('keyup', function() {
var searchTerm = $(this).val().toLowerCase();
// If the search term is cleared
if (searchTerm.trim() === '') {
// Reset the table to show the selected number of rows
var selectedValue = $('#maxRows').val();
updateVisibleRows(parseInt(selectedValue), 1); // Show the first page with the selected number of rows
return; // Exit the search functionality
}
$('#table-id tbody tr').each(function() {
var found = false;
var showRows = false; // Move showRows inside each order-row iteration
// Check only the first order row for visibility
if ($(this).hasClass('order-row')) {
$(this).find('td').each(function() {
var cellText = $(this).text().toLowerCase();
if (cellText.includes(searchTerm)) {
found = true;
return false; // Exit loop early if match found in current cell
}
var inputVal = $(this).find('input, select').val();
if (inputVal && inputVal.toLowerCase().includes(searchTerm)) {
found = true;
return false; // Exit loop early if match found in input/select value
}
});
// Toggle visibility of the order row
if (found) {
$(this).show();
showRows = true;
} else {
$(this).hide();
}
// Show or hide associated detail rows based on the visibility of the order row
$(this).nextUntil('.order-row').each(function() {
if ($(this).hasClass('detail-row')) {
if (showRows) {
$(this).show();
} else {
$(this).hide();
}
}
});
}
});
});
// Pagination functionality based on maxRows selection
$('#maxRows').on('change', function() {
var selectedValue = $(this).val();
$('#table-id tbody tr').hide();
$('#table-id tbody tr:lt(' + selectedValue + ')').show();
$('.page-item[data-page="1"] .page-link').click(); // Ensure we move to the first page
});
// Initial table setup
var initialMaxRows = $('#maxRows').val();
$('#table-id tbody tr').hide();
$('#table-id tbody tr:lt(' + initialMaxRows + ')').show();
function updateVisibleRows(maxRows, pageNum) {
var $table = $('#table-id');
var $orderRows = $table.find('tr.order-row');
var startIndex = (pageNum - 1) * maxRows;
var endIndex = startIndex + maxRows;
$orderRows.each(function(index) {
if (index >= startIndex && index < endIndex) {
$(this).show();
$(this).nextUntil('tr.order-row').show();
} else {
$(this).hide();
$(this).nextUntil('tr.order-row').hide();
}
});
}
getPagination('#table-id');
updateOrderTime();
function updateOrderTime() {
var orderTimestamps = document.querySelectorAll('.text-success');
var currentTime = new Date();
orderTimestamps.forEach(function(timestampCell) {
var orderTimestampString = timestampCell.textContent.trim();
var orderTimestamp = new Date(orderTimestampString);
// Check if the timestamp is valid
if (isNaN(orderTimestamp)) {
return;
}
var timeDifference = (currentTime - orderTimestamp) / 1000;
var displayText;
if (timeDifference < 60) {
displayText = 'New';
} else if (timeDifference < 3600) {
displayText = Math.floor(timeDifference / 60) + ' minute' + (Math.floor(timeDifference / 60) > 1 ? 's' : '') + ' ago';
} else if (timeDifference < 86400) {
displayText = Math.floor(timeDifference / 3600) + ' hour' + (Math.floor(timeDifference / 3600) > 1 ? 's' : '') + ' ago';
} else if (timeDifference < 2592000) {
displayText = Math.floor(timeDifference / 86400) + ' day' + (Math.floor(timeDifference / 86400) > 1 ? 's' : '') + ' ago';
} else if (timeDifference < 31536000) {
displayText = Math.floor(timeDifference / 2592000) + ' month' + (Math.floor(timeDifference / 2592000) > 1 ? 's' : '') + ' ago';
} else {
displayText = 'Old';
}
timestampCell.textContent = displayText;
});
}
function getPagination(table) {
var lastPage = 1;
var $table = $(table);
var $maxRowsSelect = $('#maxRows');
var $pagination = $('.pagination');
var $orderRows = $table.find('tr.order-row');
$maxRowsSelect.on('change', function() {
lastPage = 1;
$pagination.find('li').slice(1, -1).remove();
var maxRows = parseInt($(this).val());
if (maxRows === 5000) {
$pagination.hide();
} else {
$pagination.show();
}
setupPagination(maxRows);
updateVisibleRows(maxRows, 1);
}).val(10).change();
function setupPagination(maxRows) {
var totalRows = $orderRows.length;
var pageNum = Math.ceil(totalRows / maxRows);
for (var i = 1; i <=pageNum; i++) { $pagination.find('#prev').before( '<li class="page-item" data-page="' + i + '">\
<a class="page-link">\
<span>' + i + '</span>\
<span class="sr-only">(current)</span>\
</a>\
</li>'
).show();
}
$pagination.find('[data-page="1"]').addClass('active');
$pagination.off('click').on('click', 'li', function(evt) {
evt.preventDefault();
var $this = $(this);
var pageNum = $this.attr('data-page');
if (pageNum === 'prev') {
if (lastPage > 1) {
pageNum = --lastPage;
} else {
return;
}
} else if (pageNum === 'next') {
if (lastPage < pageNum - 1) {
pageNum = ++lastPage;
} else {
return;
}
} else {
lastPage = pageNum;
}
$pagination.find('.active').removeClass('active');
$pagination.find('[data-page="' + lastPage + '"]').addClass('active');
updateVisibleRows(maxRows, lastPage);
});
}
function updateVisibleRows(maxRows, pageNum) {
var startIndex = (pageNum - 1) * maxRows;
var endIndex = startIndex + maxRows;
$orderRows.hide().slice(startIndex, endIndex).show();
$orderRows.nextUntil('tr.order-row').hide().slice(startIndex, endIndex).show();
}
// Call updateVisibleRows initially to ensure correct display on load
updateVisibleRows(parseInt($maxRowsSelect.val()), 1);
limitPagging();
}
function limitPagging(){
if ($('.pagination li').length > 7) {
var activePage = parseInt($('.pagination li.active').attr('data-page'));
if (activePage <= 3) {
$('.pagination li:gt(5)').hide();
$('.pagination li:lt(5)').show();
$('.pagination [data-page="next"]').show();
} else {
$('.pagination li:gt(0)').hide();
$('.pagination [data-page="next"]').show();
for (var i = (activePage - 2); i <= (activePage + 2); i++) {
$('.pagination [data-page="' + i + '"]').show();
}
}
}
}

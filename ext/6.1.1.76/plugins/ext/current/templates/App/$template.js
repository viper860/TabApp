function init(context) {
    var toolkit = context.get("toolkit");
    context.put("universal", toolkit == '');
    context.put("classic", toolkit == 'classic');
    context.put("modern", toolkit == 'modern');
}
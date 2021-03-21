const getLastModified = (templateData) => {
    return templateData.history.reduce((max, e) => {
        if (
            new Date(e.data.timestamp).getTime() <=
            new Date(max.data.timestamp).getTime()
        ) {
            return e;
        } else {
            return max;
        }
    });
}

module.exports = getLastModified;

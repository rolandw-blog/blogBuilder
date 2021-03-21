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

const getFirstModified = (templateData) => {
    return templateData.history.reduce((min, e) => {
        if (
            new Date(e.data.timestamp).getTime() >=
            new Date(min.data.timestamp).getTime()
        ) {
            return e;
        } else {
            return min;
        }
    });
}

module.exports = {getLastModified, getFirstModified};

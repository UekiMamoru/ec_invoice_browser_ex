type SiteHistoryTitleProp = {title:string}

/**
 *
 * @param prop
 * @constructor
 */
export const SiteHistoryTitle = (prop:SiteHistoryTitleProp) => {
    let {title} = prop;
    return (
        <>
            <p>{title}</p>
        </>
    )
};
import { useState, useEffect, useCallback } from "react";
import "./Pager.css";

const Pager = ({ numItems, itemsPerPage, defaultIndex = 0, onPageChange }) => {
    const [indexes, setIndexes] = useState([]);
    const [selectedPage, setSelectedPage] = useState(defaultIndex);

    useEffect(() => {
        const localIndexes = [];
        for (let i = 0; i < numItems; i = i + itemsPerPage) {
            localIndexes.push(i);
        }
        setIndexes(localIndexes);
    }, [numItems, itemsPerPage]);

    useEffect(() => {
        setSelectedPage(defaultIndex / itemsPerPage);
    }, [defaultIndex, itemsPerPage]);

    const changePage = useCallback((page, index) => {
        setSelectedPage(page);
        onPageChange && onPageChange(index !== undefined ? index : page * itemsPerPage);
    }, [onPageChange, itemsPerPage]);

    if (indexes.length < 2) return '';

    let indexGroups;
    if (indexes.length < 5) {
        indexGroups = [[...indexes]];
    } else {
        const startIndex = selectedPage < 6 ? 0 : selectedPage - 2;
        const indexGroups = [indexes.slice(startIndex, selectedPage + 3)];
        if (selectedPage > 5) {
            indexGroups.unshift([indexes[0]]);
        }
        if (indexes.length > selectedPage + 3) {
            indexGroups.push([indexes[indexes.length - 1]]);
        }
    }

    return (
        <div className="pager">
            <div className="pagerInfo">
                Displaying {selectedPage * itemsPerPage + 1}-{Math.min((selectedPage + 1) * itemsPerPage, numItems)} of {numItems}
            </div>
            <div className="pagerList">
                <div>
                    <button onClick={e => changePage(selectedPage - 1)} disabled={selectedPage === 0}>Prev</button>
                </div>
                {
                    indexGroups.map((i, n) => (
                        <div className="pagerGroup" key={`pager-group${n}`}>
                            {
                                i.map((e, c) => (
                                    <div key={`pager${n}${c}`} className={c === selectedPage ? 'selected' : ''}>
                                        <a href="/" onClick={event => { event.preventDefault(); changePage(e / itemsPerPage, e) }}>{e / itemsPerPage + 1}</a>
                                    </div>
                                ))
                            }
                            {
                                n !== indexGroups.length - 1 && <div>...</div>
                            }
                        </div>
                    ))
                }
                <div>
                    <button onClick={e => changePage(selectedPage + 1)} disabled={selectedPage === indexes.length - 1}>Next</button>
                </div>
            </div>
        </div>
    )
}

export default Pager;
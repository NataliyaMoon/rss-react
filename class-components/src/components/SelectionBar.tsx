import { useDispatch, useSelector } from 'react-redux';
import { clearSelection } from './slices/peopleSlice';
import type { RootState } from './../store';
import './SelectionBar.css';
import { useEffect, useRef, useState } from 'react';

export default function SelectionBar() {
  const dispatch = useDispatch();
  const selectedMap = useSelector((state: RootState) => state.people.selected);
  const selectedArray = Object.values(selectedMap);
  const selectedCount = selectedArray.length;

  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string | null>(null);

  useEffect(() => {
    if (csvUrl && downloadLinkRef.current) {
      downloadLinkRef.current.click();
      URL.revokeObjectURL(csvUrl);
      setCsvUrl(null);
      setDownloadName(null);
    }
  }, [csvUrl]);

  if (selectedCount === 0) return null;

  const handleClear = () => {
    dispatch(clearSelection());
  };

  const handleDownload = () => {
    const csvHeaders = ['Name', 'Birth Year', 'Gender', 'Height', 'Mass', 'Eye Color', 'URL'];
    const csvRows = selectedArray.map((person) => [
      person.name,
      person.birth_year,
      person.gender,
      person.height,
      person.mass,
      person.eye_color,
      person.url,
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === 'string' && cell.includes(',')
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          )
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    setCsvUrl(blobUrl);
    setDownloadName(`${selectedCount}_items.csv`);
  };

  return (
    <div className="selection-bar">
      <span className="selection-bar__text">{selectedCount} item(-s) are selected</span>
      <button className="selection-bar__button" onClick={handleClear}>
        Unselect all
      </button>
      <button className="selection-bar__button" onClick={handleDownload}>
        Download
      </button>
      {csvUrl && downloadName && (
        <a
          ref={downloadLinkRef}
          href={csvUrl}
          download={downloadName}
          style={{ display: 'none' }}
        >
          Download
        </a>
      )}
    </div>
  );
}

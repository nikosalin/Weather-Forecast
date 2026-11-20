import { useState } from 'react';
import { usePlaceSearch } from '../../hooks';
import type { Place } from '../../types';
import styles from './PlaceSearch.module.css';
import type { PlaceSearchProps } from '../../types';


export function PlaceSearch({ onSelect }: PlaceSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { data: results = [], isFetching } = usePlaceSearch(query);

  const showResults = isOpen && query.trim().length >= 2;

  function selectPlace(place: Place) {
    onSelect(place);
    setQuery('');
    setIsOpen(false);
  }

  return (
    <div className={styles.root}>
      <span className={styles.searchIcon} aria-hidden="true">
        ⌕
      </span>

      <input
        className={styles.input}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsOpen(false);
          }

          if (event.key === 'Enter' && results.length > 0) {
            event.preventDefault();
            selectPlace(results[0]);
          }
        }}
        placeholder="Search a city or place…"
        aria-label="Search for a city"
      />

      {query && (
        <button
          className={styles.clearButton}
          onClick={() => {
            setQuery('');
            setIsOpen(false);
          }}
          aria-label="Clear search"
        >
          ×
        </button>
      )}

      {showResults && (
        <div className={styles.results}>
          {isFetching && <p className={styles.status}>Searching…</p>}

          {!isFetching && results.length === 0 && (
            <p className={styles.status}>No locations found.</p>
          )}

          {results.map((place) => (
            <button
              key={place.id}
              className={styles.result}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectPlace(place)}
            >
              <span className={styles.resultPin}>●</span>

              <span className={styles.resultText}>
                <strong>{place.name}</strong>
                <small>
                  {[place.admin1, place.country].filter(Boolean).join(', ')}
                </small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

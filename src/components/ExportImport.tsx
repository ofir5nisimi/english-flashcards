import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  exportAllData, 
  downloadDataAsFile, 
  parseJsonFile, 
  importData, 
  ImportOptions, 
  ExportData 
} from '../utils/exportImport';
import './ExportImport.css';

interface ExportImportProps {
  onClose: () => void;
}

const ExportImport: React.FC<ExportImportProps> = ({ onClose }) => {
  const { state } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ExportData | null>(null);
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    mergeUsers: true,
    mergeWords: true,
    replaceAll: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = exportAllData();
      downloadDataAsFile(data);
      setIsExporting(false);
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setImportResult(null);

    try {
      const data = await parseJsonFile(file);
      setImportPreview(data);
    } catch (error) {
      setImportResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to parse file'
      });
      setImportPreview(null);
    }
  };

  const handleImport = async () => {
    if (!importPreview) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await importData(importPreview, importOptions);
      setImportResult(result);

      if (result.success) {
        // Reload app state
        window.location.reload();
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: error instanceof Error ? error.message : 'Import failed'
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleOptionChange = (option: keyof ImportOptions, value: boolean) => {
    if (option === 'replaceAll' && value) {
      // If replace all is selected, disable other options
      setImportOptions({
        mergeUsers: false,
        mergeWords: false,
        replaceAll: true
      });
    } else if (option === 'replaceAll' && !value) {
      // If replace all is deselected, enable merge options
      setImportOptions({
        mergeUsers: true,
        mergeWords: true,
        replaceAll: false
      });
    } else {
      setImportOptions(prev => ({
        ...prev,
        [option]: value,
        replaceAll: false // Disable replace all if any merge option is changed
      }));
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportPreview(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="export-import">
      <div className="export-import-header">
        <h2>Export / Import Data</h2>
        <button 
          className="close-button"
          onClick={onClose}
          aria-label="Close export import manager"
        >
          ✕
        </button>
      </div>

      <div className="export-import-content">
        {/* Export Section */}
        <div className="section export-section">
          <div className="section-header">
            <h3>📤 Export Data</h3>
            <p>Download all your profiles, progress, and words as a backup file</p>
          </div>

          <div className="export-info">
            <div className="data-summary">
              <div className="summary-item">
                <span className="summary-label">Users:</span>
                <span className="summary-value">{state.users.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Words:</span>
                <span className="summary-value">{state.words.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Current User:</span>
                <span className="summary-value">{state.currentUser?.username || 'None'}</span>
              </div>
            </div>

            <button 
              className="export-button"
              onClick={handleExport}
              disabled={isExporting || (state.users.length === 0 && state.words.length === 0)}
            >
              {isExporting ? '⏳ Exporting...' : '📥 Export All Data'}
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="section import-section">
          <div className="section-header">
            <h3>📥 Import Data</h3>
            <p>Upload a backup file to restore your data</p>
          </div>

          {/* File Selection */}
          <div className="file-selection">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="file-input"
              id="import-file"
            />
            <label htmlFor="import-file" className="file-label">
              {selectedFile ? selectedFile.name : 'Choose JSON file...'}
            </label>
            {selectedFile && (
              <button className="reset-button" onClick={resetImport}>
                ✕
              </button>
            )}
          </div>

          {/* Import Preview */}
          {importPreview && (
            <div className="import-preview">
              <h4>📋 File Preview</h4>
              <div className="preview-summary">
                <div className="preview-item">
                  <span>Users: {importPreview.users?.length || 0}</span>
                </div>
                <div className="preview-item">
                  <span>Words: {importPreview.words?.length || 0}</span>
                </div>
                <div className="preview-item">
                  <span>Export Date: {importPreview.exportDate ? new Date(importPreview.exportDate).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>

              {/* Import Options */}
              <div className="import-options">
                <h4>⚙️ Import Options</h4>
                
                <div className="option-group">
                  <label className="option-label">
                    <input
                      type="checkbox"
                      checked={importOptions.replaceAll}
                      onChange={(e) => handleOptionChange('replaceAll', e.target.checked)}
                    />
                    <span className="option-text">
                      <strong>Replace All Data</strong>
                      <small>⚠️ This will completely replace all existing data</small>
                    </span>
                  </label>
                </div>

                {!importOptions.replaceAll && (
                  <div className="merge-options">
                    <p className="merge-title">Or choose what to merge:</p>
                    
                    <label className="option-label">
                      <input
                        type="checkbox"
                        checked={importOptions.mergeUsers}
                        onChange={(e) => handleOptionChange('mergeUsers', e.target.checked)}
                      />
                      <span className="option-text">
                        <strong>Merge Users</strong>
                        <small>Combine existing and imported user progress</small>
                      </span>
                    </label>

                    <label className="option-label">
                      <input
                        type="checkbox"
                        checked={importOptions.mergeWords}
                        onChange={(e) => handleOptionChange('mergeWords', e.target.checked)}
                      />
                      <span className="option-text">
                        <strong>Merge Words</strong>
                        <small>Add imported words to existing vocabulary</small>
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Import Button */}
              <button 
                className="import-button"
                onClick={handleImport}
                disabled={isImporting}
              >
                {isImporting ? '⏳ Importing...' : '📤 Import Data'}
              </button>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className={`import-result ${importResult.success ? 'success' : 'error'}`}>
              <div className="result-icon">
                {importResult.success ? '✅' : '❌'}
              </div>
              <div className="result-message">
                {importResult.message}
              </div>
              {importResult.success && (
                <div className="result-actions">
                  <p>Data imported successfully! The page will reload to apply changes.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="help-section">
        <h4>💡 Tips</h4>
        <ul>
          <li><strong>Export regularly</strong> to backup your progress</li>
          <li><strong>Merge options</strong> let you combine data from multiple devices</li>
          <li><strong>Replace all</strong> is useful for restoring from a complete backup</li>
          <li><strong>JSON files</strong> are human-readable and can be edited if needed</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportImport; 
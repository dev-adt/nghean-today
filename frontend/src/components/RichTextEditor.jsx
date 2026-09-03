import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const savedRangeRef = useRef(null);

  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals state
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'url'
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageWidth, setImageWidth] = useState('100%');
  const [imageAlign, setImageAlign] = useState('center');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');

  // Selected image for inline resizing
  const [selectedImg, setSelectedImg] = useState(null);

  // Save cursor selection range before focus is lost to modal inputs
  const saveSelection = () => {
    if (window.getSelection && window.getSelection().rangeCount > 0) {
      savedRangeRef.current = window.getSelection().getRangeAt(0);
    }
  };

  // Restore cursor selection range before inserting content
  const restoreSelection = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    if (savedRangeRef.current && window.getSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  // Sync content from prop value when not in HTML code mode, OR when toggling Fullscreen/WYSIWYG
  useEffect(() => {
    if (!isHtmlMode && editorRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isHtmlMode, isFullscreen]);

  // Click on image inside editor to select for quick resizing
  useEffect(() => {
    const handleEditorClick = (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        setSelectedImg(e.target);
      } else {
        setSelectedImg(null);
      }
    };
    const currentRef = editorRef.current;
    if (currentRef) {
      currentRef.addEventListener('click', handleEditorClick);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('click', handleEditorClick);
      }
    };
  }, [isHtmlMode, isFullscreen]);

  // Toggle Fullscreen safely while preserving ALL typed content
  const toggleFullscreen = () => {
    // 1. Read current content from editor DOM before switching state
    const currentHtml = isHtmlMode 
      ? (value || '') 
      : (editorRef.current ? editorRef.current.innerHTML : (value || ''));

    // 2. Flush current content to parent state immediately
    if (onChange) {
      onChange(currentHtml);
    }

    // 3. Toggle fullscreen state
    setIsFullscreen(prev => !prev);
  };

  // Handle Fullscreen ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, isHtmlMode, value]);

  const execCommand = (command, val = null) => {
    if (isHtmlMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Robust HTML Insertion method that works whether cursor selection was lost or not
  const insertHTMLCustom = (htmlContent) => {
    if (!htmlContent) return;

    if (isHtmlMode) {
      onChange((value || '') + '\n' + htmlContent);
      return;
    }

    if (editorRef.current) {
      restoreSelection();
      
      let inserted = false;
      try {
        inserted = document.execCommand('insertHTML', false, htmlContent);
      } catch (e) {
        inserted = false;
      }

      // Fallback: If execCommand failed or selection was invalid, append directly
      if (!inserted || !editorRef.current.innerHTML.includes(htmlContent.substring(0, 15))) {
        editorRef.current.innerHTML = (editorRef.current.innerHTML || '') + '<br/>' + htmlContent;
      }

      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    saveSelection();
    const url = prompt('Nhập địa chỉ liên kết (URL):', 'https://');
    if (url) {
      restoreSelection();
      execCommand('createLink', url);
    }
  };

  const openImageModal = () => {
    saveSelection();
    setImageModalOpen(true);
  };

  const openVideoModal = () => {
    saveSelection();
    setVideoModalOpen(true);
  };

  // Insert Image Action
  const handleInsertImageFinal = (urlToInsert) => {
    if (!urlToInsert || !urlToInsert.trim()) {
      alert('Vui lòng nhập đường dẫn hình ảnh hợp lệ.');
      return;
    }

    let marginStyle = '12px auto';
    if (imageAlign === 'left') marginStyle = '12px auto 12px 0';
    if (imageAlign === 'right') marginStyle = '12px 0 12px auto';

    const imgHtml = `<img src="${urlToInsert.trim()}" style="width: ${imageWidth}; max-width: 100%; display: block; margin: ${marginStyle}; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" alt="Ảnh bài viết" />`;

    insertHTMLCustom(imgHtml);

    setImageModalOpen(false);
    setImageUrlInput('');
  };

  const handleLocalImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh hợp lệ (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('Dung lượng tệp vượt quá 50MB.');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result.split(',')[1];
        const authToken = localStorage.getItem('nghean_creator_token') || localStorage.getItem('nghean_member_token') || localStorage.getItem('nghean_admin_token');
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? 'Bearer ' + authToken : ''
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            base64Data
          })
        });
        
        const responseText = await res.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error('Máy chủ phản hồi không đúng định dạng JSON.');
        }

        if (res.ok && data.success) {
          handleInsertImageFinal(data.url);
        } else {
          alert(data.error || 'Tải ảnh lên không thành công.');
        }
      } catch (err) {
        alert('Lỗi tải ảnh: ' + err.message);
      } finally {
        setUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // Video Insert Action (YouTube, Google Drive, Vimeo, MP4)
  const handleInsertVideo = () => {
    if (!videoUrlInput || !videoUrlInput.trim()) {
      alert('Vui lòng dán liên kết Video.');
      return;
    }

    let input = videoUrlInput.trim();
    let videoHtml = '';

    // 1. YouTube Link Converter
    if (input.includes('youtube.com') || input.includes('youtu.be')) {
      let videoId = '';
      if (input.includes('watch?v=')) {
        videoId = input.split('watch?v=')[1].split('&')[0];
      } else if (input.includes('youtu.be/')) {
        videoId = input.split('youtu.be/')[1].split('?')[0];
      } else if (input.includes('youtube.com/shorts/')) {
        videoId = input.split('youtube.com/shorts/')[1].split('?')[0];
      } else if (input.includes('youtube.com/embed/')) {
        videoId = input.split('youtube.com/embed/')[1].split('?')[0];
      }
      
      const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : input;
      videoHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 16px 0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);"><iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; border-radius: 12px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    } 
    // 2. Google Drive Video Link Converter
    else if (input.includes('drive.google.com')) {
      let driveUrl = input;
      if (driveUrl.includes('/view')) {
        driveUrl = driveUrl.replace('/view', '/preview');
      } else if (!driveUrl.includes('/preview')) {
        driveUrl = driveUrl + '/preview';
      }
      videoHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 16px 0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);"><iframe src="${driveUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; border-radius: 12px;" allow="autoplay" allowfullscreen></iframe></div>`;
    } 
    // 3. Vimeo Link Converter
    else if (input.includes('vimeo.com')) {
      const vimeoId = input.split('vimeo.com/')[1].split('?')[0];
      videoHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 16px 0; border-radius: 12px;"><iframe src="https://player.vimeo.com/video/${vimeoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; border-radius: 12px;" allowfullscreen></iframe></div>`;
    } 
    // 4. Raw HTML iframe/video pasted
    else if (input.startsWith('<iframe') || input.startsWith('<video')) {
      videoHtml = input;
    }
    // 5. Direct MP4 / WebM video file
    else {
      videoHtml = `<video controls style="width: 100%; max-height: 480px; border-radius: 12px; margin: 16px 0; background: #000; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" src="${input}">Trình duyệt của bạn không hỗ trợ thẻ video.</video>`;
    }

    insertHTMLCustom(videoHtml);

    setVideoModalOpen(false);
    setVideoUrlInput('');
  };

  // Quick resize selected image in WYSIWYG
  const resizeSelectedImage = (widthVal) => {
    if (selectedImg) {
      selectedImg.style.width = widthVal;
      handleInput();
    }
  };

  const alignSelectedImage = (alignVal) => {
    if (selectedImg) {
      if (alignVal === 'left') selectedImg.style.margin = '12px auto 12px 0';
      if (alignVal === 'center') selectedImg.style.margin = '12px auto';
      if (alignVal === 'right') selectedImg.style.margin = '12px 0 12px auto';
      handleInput();
    }
  };

  const btnStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '28px',
    height: '28px',
    transition: 'background-color 0.2s',
  };

  // Render Editor Main Content
  const renderEditorBody = () => (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isFullscreen ? '100vh' : 'auto',
        border: isFullscreen ? 'none' : '1px solid var(--border-strong)',
        borderRadius: isFullscreen ? 0 : '8px',
        background: 'var(--surface-2)',
        overflow: 'hidden',
        textAlign: 'left',
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 999999 : 'auto'
      }}
    >
      {/* Formatting Toolbar */}
      <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', background: 'var(--surface-0)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Toggle HTML Code Mode */}
          <button 
            type="button" 
            onClick={() => setIsHtmlMode(!isHtmlMode)} 
            title={isHtmlMode ? "Chuyển về giao diện WYSIWYG" : "Xem/Sửa mã HTML"} 
            style={{ 
              ...btnStyle, 
              background: isHtmlMode ? '#0284c7' : 'rgba(2, 132, 199, 0.1)', 
              color: isHtmlMode ? '#fff' : '#0284c7',
              fontWeight: '600',
              padding: '4px 10px',
              fontSize: '11.5px',
              gap: '4px'
            }}
          >
            <i className="ti ti-code" style={{ fontSize: '14px' }}></i>
            {isHtmlMode ? 'WYSIWYG' : 'Mã HTML'}
          </button>

          <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 4px' }} />

          {/* Insert Image Button */}
          <button 
            type="button" 
            onClick={openImageModal} 
            title="Chèn hình ảnh (Từ máy hoặc Link URL)" 
            style={{ 
              ...btnStyle, 
              background: 'rgba(56, 189, 248, 0.15)', 
              color: 'var(--neon-cyan)',
              fontWeight: '600',
              padding: '4px 10px',
              fontSize: '11.5px',
              gap: '4px'
            }}
          >
            <i className="ti ti-photo-plus" style={{ fontSize: '14px' }}></i>
            Chèn Hình Ảnh
          </button>

          {/* Insert Video Button */}
          <button 
            type="button" 
            onClick={openVideoModal} 
            title="Chèn Video (YouTube, Google Drive, Vimeo, MP4)" 
            style={{ 
              ...btnStyle, 
              background: 'rgba(239, 68, 68, 0.15)', 
              color: '#ef4444',
              fontWeight: '600',
              padding: '4px 10px',
              fontSize: '11.5px',
              gap: '4px'
            }}
          >
            <i className="ti ti-video" style={{ fontSize: '14px' }}></i>
            Chèn Video
          </button>

          <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 4px' }} />

          {!isHtmlMode && (
            <>
              {/* Paragraph format */}
              <button type="button" onClick={() => execCommand('formatBlock', '<h1>')} title="Tiêu đề H1" style={btnStyle} className="hover-highlight">H1</button>
              <button type="button" onClick={() => execCommand('formatBlock', '<h2>')} title="Tiêu đề H2" style={btnStyle} className="hover-highlight">H2</button>
              <button type="button" onClick={() => execCommand('formatBlock', '<h3>')} title="Tiêu đề H3" style={btnStyle} className="hover-highlight">H3</button>
              <button type="button" onClick={() => execCommand('formatBlock', '<p>')} title="Đoạn văn" style={btnStyle} className="hover-highlight">P</button>
              
              <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 4px' }} />

              {/* Text styling */}
              <button type="button" onClick={() => execCommand('bold')} title="In đậm" style={btnStyle} className="hover-highlight">
                <i className="ti ti-bold" style={{ fontSize: '14px' }}></i>
              </button>
              <button type="button" onClick={() => execCommand('italic')} title="In nghiêng" style={btnStyle} className="hover-highlight">
                <i className="ti ti-italic" style={{ fontSize: '14px' }}></i>
              </button>
              <button type="button" onClick={() => execCommand('underline')} title="Gạch chân" style={btnStyle} className="hover-highlight">
                <i className="ti ti-underline" style={{ fontSize: '14px' }}></i>
              </button>

              <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 4px' }} />

              {/* Font Size & Color */}
              <select
                onChange={(e) => execCommand('fontSize', e.target.value)}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  outline: 'none',
                  backgroundColor: 'var(--surface-2)',
                  margin: '0 2px',
                  height: '24px'
                }}
                title="Cỡ chữ"
              >
                <option value="3">Cỡ chữ</option>
                <option value="1">Rất nhỏ</option>
                <option value="2">Nhỏ</option>
                <option value="3">Bình thường</option>
                <option value="4">Lớn</option>
                <option value="5">Rất lớn</option>
                <option value="6">Cực lớn</option>
                <option value="7">Khổng lồ</option>
              </select>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', margin: '0 4px', position: 'relative' }} title="Màu chữ">
                <i className="ti ti-palette" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}></i>
                <input 
                  type="color" 
                  onChange={(e) => execCommand('foreColor', e.target.value)}
                  defaultValue="#000000"
                  style={{
                    width: '18px',
                    height: '18px',
                    border: 'none',
                    padding: 0,
                    background: 'none',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 4px' }} />

              {/* Lists & Alignment */}
              <button type="button" onClick={() => execCommand('insertUnorderedList')} title="Danh sách gạch đầu dòng" style={btnStyle} className="hover-highlight">
                <i className="ti ti-list" style={{ fontSize: '14px' }}></i>
              </button>
              <button type="button" onClick={() => execCommand('insertOrderedList')} title="Danh sách số" style={btnStyle} className="hover-highlight">
                <i className="ti ti-list-numbers" style={{ fontSize: '14px' }}></i>
              </button>

              <button type="button" onClick={() => execCommand('justifyLeft')} title="Căn trái" style={btnStyle} className="hover-highlight">
                <i className="ti ti-align-left" style={{ fontSize: '14px' }}></i>
              </button>
              <button type="button" onClick={() => execCommand('justifyCenter')} title="Căn giữa" style={btnStyle} className="hover-highlight">
                <i className="ti ti-align-center" style={{ fontSize: '14px' }}></i>
              </button>
              <button type="button" onClick={() => execCommand('justifyRight')} title="Căn phải" style={btnStyle} className="hover-highlight">
                <i className="ti ti-align-right" style={{ fontSize: '14px' }}></i>
              </button>

              <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 4px' }} />

              <button type="button" onClick={insertLink} title="Chèn liên kết" style={btnStyle} className="hover-highlight">
                <i className="ti ti-link" style={{ fontSize: '14px' }}></i>
              </button>
              <button type="button" onClick={() => execCommand('removeFormat')} title="Xóa định dạng" style={btnStyle} className="hover-highlight">
                <i className="ti ti-eraser" style={{ fontSize: '14px' }}></i>
              </button>
            </>
          )}
        </div>

        {/* Right side: Fullscreen Toggle Button */}
        <div>
          <button 
            type="button" 
            onClick={toggleFullscreen} 
            title={isFullscreen ? "Thu nhỏ về bình thường (ESC)" : "Phóng to toàn màn hình để dễ chỉnh sửa"} 
            style={{ 
              ...btnStyle, 
              background: isFullscreen ? '#f59e0b' : 'rgba(245, 158, 11, 0.15)', 
              color: isFullscreen ? '#000' : '#f59e0b',
              fontWeight: '700',
              padding: '4px 10px',
              fontSize: '11.5px',
              gap: '6px'
            }}
          >
            <i className={isFullscreen ? "ti ti-minimize" : "ti ti-maximize"} style={{ fontSize: '15px' }}></i>
            {isFullscreen ? 'Thu nhỏ' : 'Phóng to màn hình'}
          </button>
        </div>
      </div>

      {/* Floating Toolbar when an Image is selected inside Editor */}
      {selectedImg && !isHtmlMode && (
        <div style={{ padding: '6px 12px', background: 'var(--surface-0)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: 'var(--neon-cyan)' }}>🖼️ Chỉnh kích cỡ ảnh:</span>
          <button type="button" onClick={() => resizeSelectedImage('25%')} style={btnStyle} className="btn-sm">25% (Nhỏ)</button>
          <button type="button" onClick={() => resizeSelectedImage('50%')} style={btnStyle} className="btn-sm">50% (Vừa)</button>
          <button type="button" onClick={() => resizeSelectedImage('75%')} style={btnStyle} className="btn-sm">75% (Lớn)</button>
          <button type="button" onClick={() => resizeSelectedImage('100%')} style={btnStyle} className="btn-sm">100% (Toàn chiều rộng)</button>
          
          <span style={{ color: 'var(--border)' }}>|</span>
          
          <button type="button" onClick={() => alignSelectedImage('left')} style={btnStyle} title="Căn trái"><i className="ti ti-align-left"></i> Trái</button>
          <button type="button" onClick={() => alignSelectedImage('center')} style={btnStyle} title="Căn giữa"><i className="ti ti-align-center"></i> Giữa</button>
          <button type="button" onClick={() => alignSelectedImage('right')} style={btnStyle} title="Căn phải"><i className="ti ti-align-right"></i> Phải</button>
        </div>
      )}

      {/* Editor Content Area */}
      {isHtmlMode ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập hoặc dán mã HTML/<iframe>/Video tại đây..."
          style={{
            width: '100%',
            flex: 1,
            minHeight: isFullscreen ? 'calc(100vh - 60px)' : '260px',
            maxHeight: isFullscreen ? 'none' : '450px',
            padding: '16px',
            fontSize: '13.5px',
            fontFamily: 'monospace',
            color: '#38bdf8',
            background: '#0f172a',
            border: 'none',
            outline: 'none',
            resize: isFullscreen ? 'none' : 'vertical',
            boxSizing: 'border-box'
          }}
        />
      ) : (
        <div 
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          style={{ 
            flex: 1,
            minHeight: isFullscreen ? 'calc(100vh - 60px)' : '240px', 
            maxHeight: isFullscreen ? 'none' : '420px',
            overflowY: 'auto',
            padding: isFullscreen ? '2rem 4rem' : '16px', 
            color: 'var(--text-primary)', 
            outline: 'none',
            fontSize: '14px',
            lineHeight: '1.7',
            background: isFullscreen ? 'var(--surface-1)' : 'transparent'
          }}
          placeholder={placeholder}
        />
      )}

      {/* MODAL 1: CHÈN HÌNH ẢNH (Tải từ máy hoặc Link URL + Chọn kích cỡ) */}
      {imageModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '1.5rem', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid var(--border-strong)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ti ti-photo" style={{ color: 'var(--neon-cyan)' }}></i> Chèn Hình Ảnh Vào Bài Viết
              </h3>
              <button onClick={() => setImageModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Tab selection */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', background: 'var(--surface-0)', padding: '4px', borderRadius: '8px' }}>
              <button 
                type="button" 
                onClick={() => setImageTab('upload')} 
                style={{ flex: 1, padding: '6px 12px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: imageTab === 'upload' ? 'var(--primary)' : 'transparent', color: imageTab === 'upload' ? '#fff' : 'var(--text-secondary)' }}
              >
                <i className="ti ti-upload"></i> Tải ảnh từ máy
              </button>
              <button 
                type="button" 
                onClick={() => setImageTab('url')} 
                style={{ flex: 1, padding: '6px 12px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: imageTab === 'url' ? 'var(--primary)' : 'transparent', color: imageTab === 'url' ? '#fff' : 'var(--text-secondary)' }}
              >
                <i className="ti ti-link"></i> Nhập link URL ảnh
              </button>
            </div>

            {/* Tab Contents */}
            {imageTab === 'upload' ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Chọn tệp ảnh từ thiết bị của bạn:</label>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLocalImageUpload}
                  disabled={uploadingImage}
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px dashed var(--border-strong)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }} 
                />
                {uploadingImage && <div style={{ fontSize: '12.5px', color: 'var(--neon-cyan)', marginTop: '6px' }}>⏳ Đang tải ảnh lên...</div>}
              </div>
            ) : (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Đường dẫn liên kết hình ảnh (URL):</label>
                <input 
                  type="url" 
                  value={imageUrlInput} 
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/hinh-anh.jpg" 
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none', fontSize: '13px', color: 'var(--text-primary)' }} 
                />
              </div>
            )}

            {/* Size & Align Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: 'var(--surface-0)', padding: '12px', borderRadius: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>Kích cỡ hiển thị:</label>
                <select 
                  value={imageWidth} 
                  onChange={(e) => setImageWidth(e.target.value)}
                  style={{ width: '100%', padding: '6px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12.5px', color: 'var(--text-primary)' }}
                >
                  <option value="25%">25% (Nhỏ)</option>
                  <option value="50%">50% (Vừa)</option>
                  <option value="75%">75% (Lớn)</option>
                  <option value="100%">100% (Toàn chiều rộng)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>Căn lề hình ảnh:</label>
                <select 
                  value={imageAlign} 
                  onChange={(e) => setImageAlign(e.target.value)}
                  style={{ width: '100%', padding: '6px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12.5px', color: 'var(--text-primary)' }}
                >
                  <option value="left">Trái</option>
                  <option value="center">Giữa (Cân đối)</option>
                  <option value="right">Phải</option>
                </select>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setImageModalOpen(false)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>Hủy</button>
              {imageTab === 'url' && (
                <button type="button" onClick={() => handleInsertImageFinal(imageUrlInput)} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>Chèn ảnh</button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: CHÈN VIDEO (YouTube, Google Drive, Vimeo, MP4) */}
      {videoModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '540px', padding: '1.5rem', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid var(--border-strong)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ti ti-video" style={{ color: '#ef4444' }}></i> Chèn Video Vào Bài Viết
              </h3>
              <button onClick={() => setVideoModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', background: 'var(--surface-0)', padding: '10px 12px', borderRadius: '8px' }}>
              💡 <strong>Hỗ trợ đa dạng nền tảng:</strong><br />
              • Link YouTube (`https://www.youtube.com/watch?v=...` hoặc `youtu.be/...`)<br />
              • Link Google Drive xem Video (`https://drive.google.com/file/d/.../view`)<br />
              • Link Vimeo hoặc tệp Video trực tiếp (`.mp4`, `.webm`)
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Dán đường link Video hoặc mã nhúng &lt;iframe&gt;:</label>
              <textarea 
                value={videoUrlInput} 
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="Dán link Video YouTube, Google Drive hoặc Vimeo tại đây..." 
                rows={3}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none', fontSize: '13px', color: 'var(--text-primary)', resize: 'vertical' }} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setVideoModalOpen(false)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>Hủy</button>
              <button type="button" onClick={handleInsertVideo} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px', background: '#ef4444' }}>Chèn Video</button>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic inline styles */}
      <style>{`
        .hover-highlight:hover {
          background-color: rgba(12,35,64,0.1) !important;
        }
        .btn-sm {
          padding: 2px 6px !important;
          font-size: 11px !important;
          border: 1px solid var(--border) !important;
          border-radius: 4px !important;
        }
        .btn-sm:hover {
          background: var(--primary) !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );

  if (isFullscreen) {
    return createPortal(renderEditorBody(), document.body);
  }

  return renderEditorBody();
};

export default RichTextEditor;

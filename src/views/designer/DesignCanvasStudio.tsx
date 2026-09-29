import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import { CanvasElement, DigitalDesign } from '../../types/designer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { 
  Scissors, 
  Square, 
  Circle, 
  Minus, 
  Plus, 
  Trash2, 
  Copy, 
  Undo, 
  Redo, 
  Save, 
  ZoomIn, 
  ZoomOut, 
  Palette, 
  Sparkles,
  Layers,
  Code
} from 'lucide-react';

export const DesignCanvasStudio: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [designName, setDesignName] = useState('Architectural Silk Corset Gown');
  const [description, setDescription] = useState('Sculptural couture design with asymmetric silk organza drape folds.');
  const [selectedElementId, setSelectedElementId] = useState<string | null>('el-bodice-1');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showJsonModal, setShowJsonModal] = useState(false);

  // Canvas elements state
  const [elements, setElements] = useState<CanvasElement[]>([
    { id: 'el-bodice-1', type: 'garment_base', name: 'Bodice Base Structure', x: 250, y: 150, width: 300, height: 420, fill: '#16161A', stroke: '#D4AF37', strokeWidth: 2, componentType: 'bodice' },
    { id: 'el-collar-1', type: 'component', name: 'Trench Collar Lapel', x: 280, y: 130, width: 240, height: 90, fill: '#D4AF37', componentType: 'collar' },
    { id: 'el-sleeve-left', type: 'component', name: 'Asymmetric Drape Sleeve', x: 180, y: 180, width: 90, height: 320, fill: '#C5A059', componentType: 'sleeve' },
    { id: 'el-sleeve-right', type: 'component', name: 'Structured Right Sleeve', x: 530, y: 180, width: 90, height: 320, fill: '#16161A', componentType: 'sleeve' },
    { id: 'el-skirt-1', type: 'component', name: 'A-Line Pleated Skirt Train', x: 230, y: 550, width: 340, height: 380, fill: '#0F0F11', stroke: '#D4AF37', componentType: 'skirt' },
    { id: 'el-pocket-1', type: 'component', name: 'Utility Flap Pocket', x: 300, y: 360, width: 80, height: 90, fill: '#D4AF37', componentType: 'pocket' },
    { id: 'el-button-1', type: 'component', name: 'Gold Bullion Button', x: 390, y: 260, width: 20, height: 20, fill: '#FFD700', componentType: 'button' }
  ]);

  // Selected element object
  const selectedElement = elements.find(e => e.id === selectedElementId);

  const addGarmentComponent = (type: CanvasElement['componentType'], name: string, fill = '#D4AF37') => {
    const newEl: CanvasElement = {
      id: `el-${Date.now()}`,
      type: 'component',
      name,
      x: 350,
      y: 300,
      width: 100,
      height: 100,
      fill,
      componentType: type
    };
    setElements(prev => [...prev, newEl]);
    setSelectedElementId(newEl.id);
    showToast(`Added ${name} to design canvas.`);
  };

  const updateSelectedElement = (key: keyof CanvasElement, val: any) => {
    if (!selectedElementId) return;
    setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, [key]: val } : el));
  };

  const handleDuplicate = () => {
    if (!selectedElement) return;
    const duplicated: CanvasElement = {
      ...selectedElement,
      id: `el-${Date.now()}`,
      name: `${selectedElement.name} (Copy)`,
      x: selectedElement.x + 30,
      y: selectedElement.y + 30
    };
    setElements(prev => [...prev, duplicated]);
    setSelectedElementId(duplicated.id);
    showToast('Element duplicated.');
  };

  const handleDelete = () => {
    if (!selectedElementId) return;
    setElements(prev => prev.filter(el => el.id !== selectedElementId));
    setSelectedElementId(null);
    showToast('Element deleted.', 'info');
  };

  const handleSaveDesign = async (status: 'draft' | 'submitted' | 'published') => {
    const designJson = {
      canvas: { width: 800, height: 1000, backgroundColor: '#0B0B0D' },
      elements
    };

    await dataService.saveDigitalDesign({
      designerId: 'des-1',
      designerName: 'Maison Rostova',
      name: designName,
      description,
      previewImageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600',
      designJson,
      status,
      isPublic: status === 'published',
      likesCount: 0,
      savesCount: 0,
      viewsCount: 1
    });

    showToast(`Design "${designName}" saved as ${status.toUpperCase()}! ✨`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Studio Toolbar Header */}
      <div className="bg-[#121215] border border-[#26262E] p-4 rounded-2xl flex flex-col md:flex-row justify-between items-md-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <input
              type="text"
              value={designName}
              onChange={e => setDesignName(e.target.value)}
              className="bg-transparent font-serif text-xl font-bold text-white focus:outline-none border-b border-transparent focus:border-[#D4AF37]"
            />
            <span className="block text-[10px] text-gray-400">Interactive Canvas Digital Garment Studio</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="dark" size="sm" onClick={() => setShowJsonModal(true)}>
            <Code className="w-4 h-4" /> Export JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSaveDesign('draft')}>
            <Save className="w-4 h-4" /> Save Draft
          </Button>
          <Button variant="gold" size="sm" onClick={() => handleSaveDesign('published')}>
            <Sparkles className="w-4 h-4" /> Publish Design
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Toolbar (3 Cols): Add Garment Components */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-gray-400">Garment Base Templates</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'bodice', label: 'Bodice' },
                { type: 'skirt', label: 'Skirt / Train' },
                { type: 'pant', label: 'Trousers' },
                { type: 'jacket', label: 'Blazer' }
              ].map(t => (
                <button
                  key={t.type}
                  onClick={() => addGarmentComponent(t.type as any, `${t.label} Component`)}
                  className="p-3 bg-[#16161A] border border-[#26262E] hover:border-[#D4AF37] rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all text-center"
                >
                  {t.label}
                </button>
              ))}
            </div>

            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-gray-400 pt-3 border-t border-[#26262E]">Add Garment Details</h4>
            <div className="space-y-2">
              <Button variant="dark" size="sm" onClick={() => addGarmentComponent('collar', 'Lapel Collar')} className="w-full justify-start text-xs">
                + Collar / Lapel
              </Button>
              <Button variant="dark" size="sm" onClick={() => addGarmentComponent('sleeve', 'Sleeve Draping')} className="w-full justify-start text-xs">
                + Sleeve Component
              </Button>
              <Button variant="dark" size="sm" onClick={() => addGarmentComponent('pocket', 'Utility Flap Pocket')} className="w-full justify-start text-xs">
                + Pocket Detail
              </Button>
              <Button variant="dark" size="sm" onClick={() => addGarmentComponent('button', 'Bullion Button', '#FFD700')} className="w-full justify-start text-xs">
                + Metal Buttons
              </Button>
              <Button variant="dark" size="sm" onClick={() => addGarmentComponent('embroidery', 'Gold Thread Embroidery', '#D4AF37')} className="w-full justify-start text-xs">
                + Embroidery Pattern
              </Button>
            </div>
          </Card>

          {/* Canvas Layers Inspector */}
          <Card className="p-4 space-y-3">
            <h4 className="font-serif text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Layers ({elements.length})</span>
              <Layers className="w-4 h-4 text-[#D4AF37]" />
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
              {elements.map(el => (
                <div
                  key={el.id}
                  onClick={() => setSelectedElementId(el.id)}
                  className={`p-2 rounded-xl text-xs flex justify-between items-center cursor-pointer border transition-all ${
                    selectedElementId === el.id ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold' : 'bg-[#16161A] border-[#26262E] text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{el.name}</span>
                  <div className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: el.fill }}></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Center SVG/Canvas Workspace (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-4 bg-[#0B0B0D] border-[#26262E] relative overflow-hidden flex flex-col items-center justify-center min-h-[600px] shadow-2xl">
            
            {/* Canvas Control Bar */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#121215]/80 backdrop-blur-md p-1.5 rounded-xl border border-[#26262E]">
              <button onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))} className="p-1.5 text-gray-400 hover:text-white">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#D4AF37] px-2">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))} className="p-1.5 text-gray-400 hover:text-white">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Vector SVG Canvas */}
            <div className="w-full h-full flex items-center justify-center" style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease' }}>
              <svg width="600" height="750" viewBox="0 0 800 1000" className="drop-shadow-2xl border border-white/5 rounded-3xl bg-[#0F0F11]">
                
                {/* Mannequin Guidelines Overlay */}
                <g opacity="0.15" stroke="#FFFFFF" strokeDasharray="4 4" fill="none">
                  <ellipse cx="400" cy="120" rx="35" ry="45" />
                  <line x1="400" y1="165" x2="400" y2="900" />
                  <line x1="260" y1="200" x2="540" y2="200" />
                  <line x1="280" y1="520" x2="520" y2="520" />
                </g>

                {/* Render Canvas Elements */}
                {elements.map(el => {
                  const isSelected = selectedElementId === el.id;
                  return (
                    <g 
                      key={el.id} 
                      onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}
                      className="cursor-pointer group"
                    >
                      <rect
                        x={el.x}
                        y={el.y}
                        width={el.width}
                        height={el.height}
                        rx="16"
                        fill={el.fill}
                        stroke={isSelected ? '#D4AF37' : el.stroke || '#26262E'}
                        strokeWidth={isSelected ? 3 : el.strokeWidth || 1}
                        className="transition-all"
                      />
                      {isSelected && (
                        <rect
                          x={el.x - 4}
                          y={el.y - 4}
                          width={el.width + 8}
                          height={el.height + 8}
                          rx="20"
                          fill="none"
                          stroke="#D4AF37"
                          strokeDasharray="6 6"
                        />
                      )}
                      <text x={el.x + 12} y={el.y + 24} fill="#FFFFFF" fontSize="11" opacity="0.7" fontWeight="bold">
                        {el.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </Card>
        </div>

        {/* Right Element Inspector & Color Properties (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-gray-400">Element Inspector</h4>

            {selectedElement ? (
              <div className="space-y-4">
                <Input
                  label="Element Name"
                  value={selectedElement.name}
                  onChange={e => updateSelectedElement('name', e.target.value)}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Width (px)"
                    type="number"
                    value={selectedElement.width}
                    onChange={e => updateSelectedElement('width', Number(e.target.value))}
                  />
                  <Input
                    label="Height (px)"
                    type="number"
                    value={selectedElement.height}
                    onChange={e => updateSelectedElement('height', Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Fill Color</label>
                  <input
                    type="color"
                    value={selectedElement.fill || '#16161A'}
                    onChange={e => updateSelectedElement('fill', e.target.value)}
                    className="w-full h-10 rounded-xl cursor-pointer bg-[#16161A] border border-[#26262E]"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#26262E]">
                  <Button variant="dark" size="sm" onClick={handleDuplicate} className="flex-1 text-xs">
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </Button>
                  <Button variant="danger" size="sm" onClick={handleDelete} className="p-2">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Select an element on the canvas to inspect its vector properties.</p>
            )}
          </Card>
        </div>

      </div>

      {/* Design JSON Modal Export */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <Card className="max-w-2xl w-full p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-[#D4AF37]" /> Exported Design JSON Schema
            </h3>
            <pre className="bg-[#0B0B0D] p-4 rounded-xl border border-[#26262E] text-xs text-emerald-400 overflow-x-auto max-h-96">
              {JSON.stringify({
                canvas: { width: 1200, height: 1600, backgroundColor: '#0B0B0D' },
                elements
              }, null, 2)}
            </pre>
            <div className="flex justify-end">
              <Button variant="gold" onClick={() => setShowJsonModal(false)}>Close Modal</Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

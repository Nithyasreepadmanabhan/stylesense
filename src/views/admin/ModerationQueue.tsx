import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import { DigitalDesign, DesignerProfile } from '../../types/designer';
import { ModerationReport } from '../../types/admin';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export const ModerationQueue: React.FC = () => {
  const { showToast } = useToast();

  const [designs, setDesigns] = useState<DigitalDesign[]>([]);
  const [designers, setDesigners] = useState<DesignerProfile[]>([]);
  const [reports, setReports] = useState<ModerationReport[]>([]);

  useEffect(() => {
    loadModerationData();
  }, []);

  const loadModerationData = async () => {
    const dList = await dataService.getDesigns();
    setDesigns(dList.filter(d => d.status === 'submitted'));

    const desList = await dataService.getDesigners();
    setDesigners(desList.filter(d => d.verificationStatus === 'pending'));

    const repList = await dataService.getReports();
    setReports(repList);
  };

  const handleApproveDesign = async (id: string, name: string) => {
    await dataService.updateDesignStatus(id, 'published');
    showToast(`Approved & published design "${name}"!`);
    loadModerationData();
  };

  const handleRejectDesign = async (id: string, name: string) => {
    await dataService.updateDesignStatus(id, 'rejected');
    showToast(`Rejected design "${name}".`, 'warning');
    loadModerationData();
  };

  const handleVerifyDesigner = async (id: string, brandName: string, status: 'approved' | 'rejected') => {
    await dataService.verifyDesigner(id, status);
    showToast(`${status === 'approved' ? 'Verified' : 'Rejected'} designer "${brandName}".`);
    loadModerationData();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      <div className="border-b border-[#26262E] pb-6">
        <h1 className="font-serif text-3xl font-bold text-white">Platform Content Moderation Queue</h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Approve or reject submitted digital designs, designer applications, and flagged reports.</p>
      </div>

      {/* Pending Submitted Designs */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" /> Pending Design Approvals ({designs.length})
        </h3>

        {designs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map(des => (
              <Card key={des.id} className="p-5 flex flex-col justify-between">
                <div>
                  <img src={des.previewImageUrl} alt={des.name} className="w-full h-44 object-cover rounded-xl mb-3" />
                  <Badge variant="terracotta" className="mb-1">Pending Approval</Badge>
                  <h4 className="font-serif text-lg font-bold text-white">{des.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{des.description}</p>
                  <span className="text-[11px] text-[#D4AF37] block mt-2">By {des.designerName}</span>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-[#26262E]">
                  <Button variant="gold" size="sm" onClick={() => handleApproveDesign(des.id, des.name)} className="flex-1">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleRejectDesign(des.id, des.name)}>
                    <XCircle className="w-4 h-4" /> Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-gray-400 text-xs">
            ✓ No submitted designs awaiting moderation approval.
          </Card>
        )}
      </div>

      {/* Pending Designer Verification Applications */}
      <div className="space-y-4 pt-4 border-t border-[#26262E]">
        <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" /> Designer Verification Applications ({designers.length})
        </h3>

        {designers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {designers.map(des => (
              <Card key={des.id} className="p-5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src={des.logoUrl} alt={des.brandName} className="w-12 h-12 rounded-full border border-purple-400 object-cover" />
                  <div>
                    <h4 className="font-serif text-base font-bold text-white">{des.brandName}</h4>
                    <p className="text-xs text-gray-400">{des.bio}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="gold" size="sm" onClick={() => handleVerifyDesigner(des.id, des.brandName, 'approved')}>
                    Approve
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleVerifyDesigner(des.id, des.brandName, 'rejected')}>
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-gray-400 text-xs">
            ✓ All designer verification applications reviewed.
          </Card>
        )}
      </div>

    </div>
  );
};

import React from 'react';
import { SellLetterDocument, ShowroomSettings } from '../types';
import { Printer, Download, Edit, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';

interface PrintDocumentViewProps {
  letter: SellLetterDocument;
  showroom: ShowroomSettings;
  onBack?: () => void;
  onEdit?: () => void;
}

export const PrintDocumentView: React.FC<PrintDocumentViewProps> = ({
  letter,
  showroom,
  onBack,
  onEdit
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-600 text-slate-900 pb-16 pt-4 px-2 sm:px-4">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print max-w-[210mm] mx-auto mb-4 bg-slate-900 text-white rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              id="btn-back-to-list"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          <div>
            <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Document Preview: {letter.serialNo}
            </h2>
            <p className="text-xs text-slate-400">
              Vehicle: {letter.vehicle.registrationNo} — {letter.vehicle.make} {letter.vehicle.model}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              id="btn-edit-letter"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" /> Edit Data
            </button>
          )}
          <button
            onClick={handlePrint}
            id="btn-trigger-print"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF (2 Pages)
          </button>
        </div>
      </div>

      {/* Modern High-Fidelity Print CSS Styles matching user spec */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@500;700&display=swap');

        .print-canvas {
          --navy: #16233F;
          --navy-soft: #2C3D63;
          --brass: #A9793C;
          --brass-light: #C99B5E;
          --paper: #FDFCFA;
          --ink: #1B1B1B;
          --ink-soft: #5B5B5B;
          --line: #C7C2B8;
          --line-soft: #E4E0D8;
          font-family: 'Inter', Arial, sans-serif;
        }

        .page-sheet {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto 20px auto;
          background: #FDFCFA;
          padding: 8mm 11mm 6mm;
          position: relative;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
          box-sizing: border-box;
          color: #1B1B1B;
        }

        .letterhead {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10mm;
          padding-bottom: 2.4mm;
        }

        .brand-logo-circle {
          width: 23mm;
          height: 23mm;
          border: 1.5px solid #A9793C;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          flex: none;
        }

        .brand-text .name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 25pt;
          color: #16233F;
          letter-spacing: 0.4px;
          line-height: 1;
        }

        .brand-text .tagline {
          font-size: 8pt;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #A9793C;
          margin-top: 1.6mm;
          font-weight: 600;
        }

        .contact-block {
          text-align: right;
          font-size: 8pt;
          color: #5B5B5B;
          line-height: 1.55;
          padding-top: 1mm;
          max-width: 60mm;
        }

        .contact-block strong { color: #16233F; }

        .rule-bar {
          height: 0;
          border-top: 2px solid #16233F;
          border-bottom: 1px solid #A9793C;
          margin-top: 1mm;
        }

        .doc-title-bar {
          margin: 2.6mm 0 2.6mm;
        }

        .doc-title {
          font-family: 'Playfair Display', serif;
          font-size: 14pt;
          font-weight: 700;
          color: #16233F;
          letter-spacing: 0.6px;
          text-align: center;
          text-decoration: underline;
          text-underline-offset: 2.5px;
        }

        .doc-title span {
          color: #A9793C;
        }

        .meta-strip {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 2.4mm;
        }

        .meta-group { display: flex; gap: 6mm; }
        .meta-group.right .meta-item { text-align: right; }
        .meta-item { text-align: left; }
        
        .meta-item .k {
          font-size: 6.7pt;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #5B5B5B;
          margin-bottom: 0.8mm;
        }

        .meta-item .v {
          border-bottom: 1px solid #C7C2B8;
          min-width: 24mm;
          font-size: 9pt;
          font-weight: 600;
          padding-bottom: 0.8mm;
          color: #16233F;
        }

        .section-shell { margin-top: 2.6mm; }
        .section-head {
          display: flex;
          align-items: center;
          gap: 2.5mm;
          margin-bottom: 1.8mm;
        }

        .section-num {
          width: 5mm;
          height: 5mm;
          background: #16233F;
          color: #C99B5E;
          font-size: 7.5pt;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
        }

        .section-title {
          font-size: 9.4pt;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.4px;
          color: #16233F;
        }

        .section-title small {
          display: block;
          font-size: 7.4pt;
          font-weight: 400;
          letter-spacing: 0.3px;
          text-transform: none;
          color: #5B5B5B;
          margin-top: 0.5mm;
        }

        .section-head::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #E4E0D8;
          margin-top: 1px;
        }

        .field-row {
          display: flex;
          align-items: flex-end;
          gap: 2.5mm;
        }

        .field-row .k {
          font-size: 8pt;
          color: #5B5B5B;
          white-space: nowrap;
          padding-bottom: 0.8mm;
        }

        .field-row .v {
          flex: 1;
          border-bottom: 1px solid #C7C2B8;
          min-height: 3.6mm;
          font-size: 8.5pt;
          font-weight: 600;
          color: #16233F;
          padding-left: 2px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          column-gap: 6mm;
          row-gap: 2mm;
        }

        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          column-gap: 5mm;
          row-gap: 2mm;
        }

        .span-2 { grid-column: span 2; }
        .span-3 { grid-column: span 3; }
        .span-4 { grid-column: span 4; }

        .subhead-label {
          font-size: 7.8pt;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #A9793C;
          margin: 2.2mm 0 1.6mm;
          padding-top: 1.6mm;
          border-top: 1px dashed #E4E0D8;
        }

        .subhead-label:first-of-type {
          border-top: none;
          padding-top: 0;
        }

        .note-box {
          border: 1px solid #C7C2B8;
          border-left: 3px solid #A9793C;
          background: #F9F7F2;
          padding: 2.6mm 5mm;
          font-size: 8.6pt;
          line-height: 1.6;
          color: #1B1B1B;
        }

        .note-box .fill-line {
          display: inline-block;
          min-width: 26mm;
          border-bottom: 1px solid #5B5B5B;
          margin: 0 1mm;
          font-weight: 700;
          color: #16233F;
          text-align: center;
        }

        .split-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 8mm;
        }

        .split-col {
          position: relative;
        }

        .split-col + .split-col {
          border-left: 1px solid #E4E0D8;
          padding-left: 8mm;
          margin-left: -8mm;
        }

        .col-heading {
          font-size: 8.3pt;
          font-weight: 700;
          color: #16233F;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 1.8mm;
        }

        .yn-row {
          display: flex;
          align-items: center;
          gap: 3mm;
          margin-bottom: 2.4mm;
          font-size: 8.2pt;
          color: #5B5B5B;
        }

        .yn-row .yn-label { flex: none; color: #1B1B1B; font-weight: 500; }
        .yn-box {
          display: flex;
          align-items: center;
          gap: 1.4mm;
        }

        .yn-box .checkbox-box {
          width: 3.6mm;
          height: 3.6mm;
          border: 1.1px solid #16233F;
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 7pt;
          font-weight: 700;
        }

        .split-col .field-row { margin-bottom: 2.1mm; }

        .sign-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 4mm;
          margin-top: 3.5mm;
        }

        .sign-line {
          border-top: 1px solid #1B1B1B;
          padding-top: 1.2mm;
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #5B5B5B;
        }

        .urdu-box {
          border: 1px solid #C7C2B8;
          padding: 3mm 5mm 2.4mm;
          background: #F9F7F2;
          border-right: 3px solid #A9793C;
        }

        .urdu-text {
          direction: rtl;
          font-family: 'Noto Nastaliq Urdu', serif;
          font-size: 10pt;
          line-height: 1.9;
          color: #1B1B1B;
          text-align: justify;
          white-space: pre-line;
        }

        .urdu-sign {
          direction: rtl;
          margin-top: 3mm;
          display: flex;
          justify-content: flex-end;
        }

        .urdu-sign .box-sign {
          text-align: center;
          font-family: 'Noto Nastaliq Urdu', serif;
          font-size: 9.5pt;
        }

        .footer-line {
          margin-top: 3mm;
          padding-top: 1.6mm;
          border-top: 1px solid #E4E0D8;
          display: flex;
          justify-content: space-between;
          font-size: 6.6pt;
          color: #5B5B5B;
          letter-spacing: 0.3px;
        }

        /* PAGE 2 STYLES */
        .p2-header {
          text-align: center;
          margin-bottom: 5mm;
        }

        .p2-header .brand-mini {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 14pt;
          color: #16233F;
        }

        .p2-header .brand-mini span { color: #A9793C; }

        .p2-header .p2-title {
          font-family: 'Noto Nastaliq Urdu', serif;
          direction: rtl;
          font-size: 12pt;
          color: #1B1B1B;
          margin-top: 3mm;
          line-height: 2;
        }

        .urdu-list {
          direction: rtl;
          font-family: 'Noto Nastaliq Urdu', serif;
          font-size: 11pt;
          line-height: 2.15;
          color: #1B1B1B;
          text-align: justify;
          border: 1px solid #C7C2B8;
          border-right: 3px solid #A9793C;
          background: #F9F7F2;
          padding: 5mm 6mm;
        }

        .urdu-list ol {
          margin: 0;
          padding: 0 6mm 0 0;
          list-style: none;
          counter-reset: item;
        }

        .urdu-list li {
          counter-increment: item;
          margin-bottom: 3mm;
          position: relative;
          padding-right: 7mm;
        }

        .urdu-list li:last-child { margin-bottom: 0; }

        .urdu-list li::before {
          content: counter(item) ".";
          position: absolute;
          right: 0;
          top: 0;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          color: #A9793C;
          font-size: 10.5pt;
          direction: ltr;
        }

        .thumb-section {
          margin-top: 8mm;
        }

        .thumb-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 10mm;
        }

        .thumb-card {
          text-align: center;
        }

        .thumb-card .thumb-box {
          width: 34mm;
          height: 24mm;
          margin: 0 auto 2.5mm;
          border: 1.4px dashed #A9793C;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          font-size: 6.6pt;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #B8B2A4;
        }

        .thumb-card .sign-space {
          border-bottom: 1px solid #1B1B1B;
          height: 10mm;
          margin-bottom: 1.6mm;
        }

        .thumb-card .cap {
          direction: rtl;
          font-family: 'Noto Nastaliq Urdu', serif;
          font-size: 10.5pt;
          color: #16233F;
        }

        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          body {
            background: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .page-sheet {
            margin: 0 !important;
            width: 100% !important;
            min-height: 297mm !important;
            box-shadow: none !important;
            page-break-after: always;
            border: none !important;
          }
          .page-sheet:last-of-type {
            page-break-after: auto;
          }
        }
      `}</style>

      {/* PRINT CONTAINER */}
      <div className="print-canvas">
        {/* ===================== PAGE 1 ===================== */}
        <div className="page-sheet">
          {/* HEADER LETTERHEAD */}
          <div className="letterhead">
            <div className="flex items-center gap-4">
              <div
                className="brand-logo-circle"
                style={{
                  backgroundImage: showroom.logoUrl ? `url("${showroom.logoUrl}")` : undefined,
                  backgroundColor: !showroom.logoUrl ? '#16233F' : undefined
                }}
              >
                {!showroom.logoUrl && (
                  <span className="font-serif font-bold text-amber-500 text-xs text-center leading-tight">
                    IM
                  </span>
                )}
              </div>
              <div className="brand-text">
                <div className="name">{showroom.name || "INFINITY MOTORS"}</div>
                <div className="tagline">{showroom.tagline || "Trusted Deals · Verified Vehicles"}</div>
              </div>
            </div>
            <div className="contact-block">
              <div><strong>{showroom.addressLine1}</strong></div>
              <div>{showroom.addressLine2}</div>
              <div>Contact No: {showroom.contactNo}</div>
              {showroom.website && <div>{showroom.website}</div>}
            </div>
          </div>

          <div className="rule-bar"></div>

          {/* DOCUMENT TITLE BAR */}
          <div className="doc-title-bar">
            <div className="doc-title">
              Vehicle Sell <span>&amp;</span> Delivery Letter
            </div>
            <div className="meta-strip">
              <div className="meta-group">
                <div className="meta-item">
                  <div className="k">Serial No.</div>
                  <div className="v">{letter.serialNo || '—'}</div>
                </div>
                <div className="meta-item">
                  <div className="k">CPLC Operator#</div>
                  <div className="v">{letter.cplcOperatorNo || showroom.cplcOperatorDefault || '—'}</div>
                </div>
              </div>
              <div className="meta-group right">
                <div className="meta-item">
                  <div className="k">Date</div>
                  <div className="v">{letter.date || '—'}</div>
                </div>
                <div className="meta-item">
                  <div className="k">Time</div>
                  <div className="v">{letter.time || '—'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: VEHICLE & TRANSACTION DETAILS */}
          <div className="section-shell">
            <div className="section-head">
              <div className="section-num">1</div>
              <div className="section-title">Vehicle &amp; Transaction Details</div>
            </div>

            <div className="subhead-label">Vehicle Particulars</div>
            <div className="grid-4">
              <div className="field-row">
                <div className="k">Registration No.</div>
                <div className="v">{letter.vehicle.registrationNo}</div>
              </div>
              <div className="field-row">
                <div className="k">Make</div>
                <div className="v">{letter.vehicle.make}</div>
              </div>
              <div className="field-row">
                <div className="k">Model</div>
                <div className="v">{letter.vehicle.model}</div>
              </div>
              <div className="field-row">
                <div className="k">Colour</div>
                <div className="v">{letter.vehicle.colour}</div>
              </div>

              <div className="field-row span-2">
                <div className="k">Registration Name</div>
                <div className="v">{letter.vehicle.registrationName}</div>
              </div>
              <div className="field-row span-2">
                <div className="k">Owner CNIC</div>
                <div className="v">{letter.vehicle.ownerCnic}</div>
              </div>

              <div className="field-row">
                <div className="k">Chassis No.</div>
                <div className="v">{letter.vehicle.chassisNo}</div>
              </div>
              <div className="field-row">
                <div className="k">Engine No.</div>
                <div className="v">{letter.vehicle.engineNo}</div>
              </div>
              <div className="field-row">
                <div className="k">Engine Capacity</div>
                <div className="v">{letter.vehicle.engineCapacity}</div>
              </div>
              <div className="field-row">
                <div className="k">Book No.</div>
                <div className="v">{letter.vehicle.bookNo}</div>
              </div>
            </div>

            <div className="subhead-label">Delivery Schedule</div>
            <div className="grid-3">
              <div className="field-row">
                <div className="k">Date</div>
                <div className="v">{letter.delivery.date}</div>
              </div>
              <div className="field-row">
                <div className="k">Day</div>
                <div className="v">{letter.delivery.day}</div>
              </div>
              <div className="field-row">
                <div className="k">Time</div>
                <div className="v">{letter.delivery.time}</div>
              </div>
            </div>

            <div className="subhead-label">Payment Details</div>
            <div className="grid-3">
              <div className="field-row span-3">
                <div className="k">For Sum of Rupees (in Words)</div>
                <div className="v">{letter.payment.sumInWords}</div>
              </div>
              <div className="field-row">
                <div className="k">For Sum of Rupees (in Digits)</div>
                <div className="v">Rs. {letter.payment.sumInDigits ? letter.payment.sumInDigits.toLocaleString('en-PK') : '0'}</div>
              </div>
              <div className="field-row">
                <div className="k">Advance</div>
                <div className="v">Rs. {letter.payment.advance ? letter.payment.advance.toLocaleString('en-PK') : '0'}</div>
              </div>
              <div className="field-row">
                <div className="k">Balance</div>
                <div className="v">Rs. {letter.payment.balance ? letter.payment.balance.toLocaleString('en-PK') : '0'}</div>
              </div>
              <div className="field-row">
                <div className="k">Date of Balance</div>
                <div className="v">{letter.payment.dateOfBalance || 'N/A'}</div>
              </div>
              <div className="field-row span-2">
                <div className="k">Special Note / Conditions</div>
                <div className="v">{letter.payment.specialNote || 'None'}</div>
              </div>
            </div>

            {letter.payment.hasCheque && letter.cheque && (
              <>
                <div className="subhead-label">
                  Cheque Details <span className="normal-case text-slate-500 font-normal text-[7.5pt]">(if applicable)</span>
                </div>
                <div className="grid-4">
                  <div className="field-row">
                    <div className="k">Bank Name</div>
                    <div className="v">{letter.cheque.bankName}</div>
                  </div>
                  <div className="field-row">
                    <div className="k">Cheque No.</div>
                    <div className="v">{letter.cheque.chequeNo}</div>
                  </div>
                  <div className="field-row">
                    <div className="k">Amount</div>
                    <div className="v">Rs. {letter.cheque.amount ? letter.cheque.amount.toLocaleString('en-PK') : '0'}</div>
                  </div>
                  <div className="field-row">
                    <div className="k">Dated</div>
                    <div className="v">{letter.cheque.dated}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* SECTION 2: VERIFICATION NOTE */}
          <div className="section-shell">
            <div className="section-head">
              <div className="section-num">2</div>
              <div className="section-title">Verification Note</div>
            </div>
            <div className="note-box">
              Note: This vehicle has been verified and confirmed from the Excise Department &amp; CPLC by the purchaser,
              and found correct in all respects, dated <span className="fill-line">{letter.verificationDate || '___________'}</span>.
            </div>
          </div>

          {/* SECTION 3: PURCHASER & SELLER CONFIRMATION */}
          <div className="section-shell">
            <div className="section-head">
              <div className="section-num">3</div>
              <div className="section-title">Purchaser &amp; Seller Confirmation</div>
            </div>

            <div className="split-grid">
              {/* Purchaser */}
              <div className="split-col">
                <div className="col-heading">Purchaser Information</div>
                <div className="yn-row">
                  <div className="yn-label">Original Number Plate Received</div>
                  <div className="yn-box">
                    <div className="checkbox-box">{letter.purchaser.originalNumberPlateReceived ? '✓' : ''}</div>
                    <span>Yes</span>
                  </div>
                  <div className="yn-box">
                    <div className="checkbox-box">{!letter.purchaser.originalNumberPlateReceived ? '✓' : ''}</div>
                    <span>No</span>
                  </div>
                </div>

                <div className="field-row">
                  <div className="k">CNIC</div>
                  <div className="v">{letter.purchaser.cnic}</div>
                </div>
                <div className="field-row">
                  <div className="k">Name</div>
                  <div className="v">{letter.purchaser.name}</div>
                </div>
                <div className="field-row">
                  <div className="k">S/O</div>
                  <div className="v">{letter.purchaser.fatherName}</div>
                </div>
                <div className="field-row">
                  <div className="k">Phone / Mobile</div>
                  <div className="v">{letter.purchaser.phone}</div>
                </div>
                <div className="field-row">
                  <div className="k">Residential Address</div>
                  <div className="v">{letter.purchaser.address}</div>
                </div>
                <div className="field-row">
                  <div className="k">Witness Name</div>
                  <div className="v">{letter.purchaser.witnessName}</div>
                </div>
                <div className="field-row">
                  <div className="k">Witness CNIC</div>
                  <div className="v">{letter.purchaser.witnessCnic}</div>
                </div>

                <div className="sign-row">
                  <div className="sign-line">Sign of Purchaser</div>
                  <div className="sign-line">Signature of Witness</div>
                </div>
              </div>

              {/* Seller */}
              <div className="split-col">
                <div className="col-heading">Seller Information</div>
                <div className="yn-row">
                  <div className="yn-label">Seller Biometric Available</div>
                  <div className="yn-box">
                    <div className="checkbox-box">{letter.seller.sellerBiometricAvailable ? '✓' : ''}</div>
                    <span>Yes</span>
                  </div>
                  <div className="yn-box">
                    <div className="checkbox-box">{!letter.seller.sellerBiometricAvailable ? '✓' : ''}</div>
                    <span>No</span>
                  </div>
                </div>

                <div className="field-row">
                  <div className="k">CNIC</div>
                  <div className="v">{letter.seller.cnic}</div>
                </div>
                <div className="field-row">
                  <div className="k">Name</div>
                  <div className="v">{letter.seller.name}</div>
                </div>
                <div className="field-row">
                  <div className="k">S/O</div>
                  <div className="v">{letter.seller.fatherName}</div>
                </div>
                <div className="field-row">
                  <div className="k">Phone / Mobile</div>
                  <div className="v">{letter.seller.phone}</div>
                </div>
                <div className="field-row">
                  <div className="k">Residential Address</div>
                  <div className="v">{letter.seller.address}</div>
                </div>
                <div className="field-row">
                  <div className="k">Witness Name</div>
                  <div className="v">{letter.seller.witnessName}</div>
                </div>
                <div className="field-row">
                  <div className="k">Witness CNIC</div>
                  <div className="v">{letter.seller.witnessCnic}</div>
                </div>

                <div className="sign-row">
                  <div className="sign-line">Sign of Seller</div>
                  <div className="sign-line">Signature of Witness</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: URDU DECLARATION */}
          <div className="section-shell">
            <div className="section-head">
              <div className="section-num">4</div>
              <div className="section-title">
                Declaration <small>Undertaking by the purchaser</small>
              </div>
            </div>
            <div className="urdu-box">
              <div className="urdu-text">
                {showroom.urduDeclarationText}
              </div>
              <div className="urdu-sign">
                <div className="box-sign">
                  _________________ دستخط خریدار
                </div>
              </div>
            </div>
          </div>

          <div className="footer-line">
            <span>{showroom.name} — Vehicle Sell &amp; Delivery Letter</span>
            <span>This document is generated in duplicate and is valid only with authorized signatures &amp; stamp.</span>
          </div>
        </div>

        {/* ===================== PAGE 2 ===================== */}
        <div className="page-sheet">
          <div className="p2-header">
            <div className="brand-mini">
              {showroom.name.split(' ')[0]} <span>{showroom.name.split(' ').slice(1).join(' ')}</span>
            </div>
            <div className="p2-title">
              برائے مہربانی گاڑی خریدتے وقت مندرجہ ذیل باتوں کا اطمینان کر لیں<br />
              ورنہ گاڑی شوروم سے لے جانے کے بعد ہماری ذمہ داری نہیں ہوگی۔
            </div>
          </div>

          <div className="urdu-list">
            <ol>
              {(showroom.urduUndertakingRules && showroom.urduUndertakingRules.length > 0
                ? showroom.urduUndertakingRules
                : [
                    "گاڑی کا انجن اور چیسس نمبر خصوصی طور پر چیک کر لیں۔",
                    "گاڑی کی ڈاکومنٹیشن پر احتیاط سے جائزہ لیں۔",
                    "گاڑی کی باڈی اور شیپ اچھی طرح چیک کر لیں۔",
                    "گاڑی کہاں پر رجسٹرڈ ہے، اس کی تصدیق کر لیں۔",
                    "گاڑی کے مکمل کاغذات، اصل رجسٹریشن بک، کاپی اور مالک کے شناختی کارڈ کی بذاتِ خود تصدیق کر لیں۔",
                    "گاڑی کی خریداری کی مکمل تاریخ اور خریدار و فروخت کنندہ کا نوٹ فرما لیں۔",
                    "گاڑی کی تصدیق شوروم ایسوسی ایشن یا متعلقہ ادارے سے کروا لیں کہ گاڑی کا ریکارڈ محفوظ ہے۔",
                    "گاڑی کا ایکسائز آفس اور سی پی ایل سی سے تصدیق کروا لیں۔",
                    "گاڑی خریدنے کے بعد جلد از جلد قانونی طور پر گاڑی کا ٹرانسفر کروا لیں، ایسا نہ کرنے کی صورت میں شوروم کی کوئی ذمہ داری نہیں ہوگی۔"
                  ]
              ).map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ol>
          </div>

          <div className="thumb-section">
            <div className="thumb-row">
              <div className="thumb-card">
                <div className="sign-space"></div>
                <div className="thumb-box">THUMB IMPRESSION</div>
                <div className="cap">خریدار دستخط کر کے انگوٹھا لگائیں</div>
              </div>
              <div className="thumb-card">
                <div className="sign-space"></div>
                <div className="thumb-box">THUMB IMPRESSION</div>
                <div className="cap">فروخت کنندہ دستخط کر کے انگوٹھا لگائیں</div>
              </div>
            </div>
          </div>

          <div className="footer-line" style={{ marginTop: '12mm' }}>
            <span>{showroom.name} — Vehicle Sell &amp; Delivery Letter</span>
            <span>Page 2 of 2 — Purchaser Undertaking &amp; Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};

//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DataAccessLayer.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class MonthInvoice
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public MonthInvoice()
        {
            this.Invoices = new HashSet<Invoice>();
        }
    
        public int id { get; set; }
        public int monthNUM { get; set; }
        public int yearNUM { get; set; }
        public string Custom1_Name { get; set; }
        public string Custom2_Name { get; set; }
        public string Custom3_Name { get; set; }
        public string Custom4_Name { get; set; }
        public string Custom5_Name { get; set; }
        public System.DateTime InvoiceDate { get; set; }
        public int VAT { get; set; }
        public string InvoiceReferenceNumber { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Invoice> Invoices { get; set; }
    }
}
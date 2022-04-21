﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class GiellyGreen_RohanEntities : DbContext
    {
        public GiellyGreen_RohanEntities()
            : base("name=GiellyGreen_RohanEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<image> images { get; set; }
        public virtual DbSet<Invoice> Invoices { get; set; }
        public virtual DbSet<MonthInvoice> MonthInvoices { get; set; }
        public virtual DbSet<Supplier> Suppliers { get; set; }
    
        public virtual ObjectResult<GetImage_Result> GetImage(Nullable<int> id)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<GetImage_Result>("GetImage", idParameter);
        }
    
        public virtual ObjectResult<GETInvoice_Result> GETInvoice(Nullable<int> id, Nullable<int> monthInvoiceId)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));
    
            var monthInvoiceIdParameter = monthInvoiceId.HasValue ?
                new ObjectParameter("MonthInvoiceId", monthInvoiceId) :
                new ObjectParameter("MonthInvoiceId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<GETInvoice_Result>("GETInvoice", idParameter, monthInvoiceIdParameter);
        }
    
        public virtual ObjectResult<GETMonthInvoice_Result> GETMonthInvoice(Nullable<int> id)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<GETMonthInvoice_Result>("GETMonthInvoice", idParameter);
        }
    
        public virtual ObjectResult<GETSuppliers_Result> GETSuppliers(Nullable<int> id, Nullable<bool> onlyActive)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));
    
            var onlyActiveParameter = onlyActive.HasValue ?
                new ObjectParameter("onlyActive", onlyActive) :
                new ObjectParameter("onlyActive", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<GETSuppliers_Result>("GETSuppliers", idParameter, onlyActiveParameter);
        }
    
        public virtual int InsertUpdateInvoice(Nullable<int> id, Nullable<int> monthId, Nullable<int> supplierId, Nullable<decimal> hairService, Nullable<decimal> beautyService, Nullable<decimal> custom1, Nullable<decimal> custom2, Nullable<decimal> custom3, Nullable<decimal> custom4, Nullable<decimal> custom5, Nullable<decimal> advancePay, Nullable<bool> isApproved)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));
    
            var monthIdParameter = monthId.HasValue ?
                new ObjectParameter("MonthId", monthId) :
                new ObjectParameter("MonthId", typeof(int));
    
            var supplierIdParameter = supplierId.HasValue ?
                new ObjectParameter("SupplierId", supplierId) :
                new ObjectParameter("SupplierId", typeof(int));
    
            var hairServiceParameter = hairService.HasValue ?
                new ObjectParameter("HairService", hairService) :
                new ObjectParameter("HairService", typeof(decimal));
    
            var beautyServiceParameter = beautyService.HasValue ?
                new ObjectParameter("BeautyService", beautyService) :
                new ObjectParameter("BeautyService", typeof(decimal));
    
            var custom1Parameter = custom1.HasValue ?
                new ObjectParameter("Custom1", custom1) :
                new ObjectParameter("Custom1", typeof(decimal));
    
            var custom2Parameter = custom2.HasValue ?
                new ObjectParameter("Custom2", custom2) :
                new ObjectParameter("Custom2", typeof(decimal));
    
            var custom3Parameter = custom3.HasValue ?
                new ObjectParameter("Custom3", custom3) :
                new ObjectParameter("Custom3", typeof(decimal));
    
            var custom4Parameter = custom4.HasValue ?
                new ObjectParameter("Custom4", custom4) :
                new ObjectParameter("Custom4", typeof(decimal));
    
            var custom5Parameter = custom5.HasValue ?
                new ObjectParameter("Custom5", custom5) :
                new ObjectParameter("Custom5", typeof(decimal));
    
            var advancePayParameter = advancePay.HasValue ?
                new ObjectParameter("AdvancePay", advancePay) :
                new ObjectParameter("AdvancePay", typeof(decimal));
    
            var isApprovedParameter = isApproved.HasValue ?
                new ObjectParameter("isApproved", isApproved) :
                new ObjectParameter("isApproved", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertUpdateInvoice", idParameter, monthIdParameter, supplierIdParameter, hairServiceParameter, beautyServiceParameter, custom1Parameter, custom2Parameter, custom3Parameter, custom4Parameter, custom5Parameter, advancePayParameter, isApprovedParameter);
        }
    
        public virtual int InsertUpdateMonthInvoice(Nullable<int> id, Nullable<int> monthNUM, Nullable<int> yearNUM, string custom1_Name, string custom2_Name, string custom3_Name, string custom4_Name, string custom5_Name, Nullable<System.DateTime> invoiceDate, Nullable<int> vAT, string invoiceReferenceNumber)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));
    
            var monthNUMParameter = monthNUM.HasValue ?
                new ObjectParameter("monthNUM", monthNUM) :
                new ObjectParameter("monthNUM", typeof(int));
    
            var yearNUMParameter = yearNUM.HasValue ?
                new ObjectParameter("yearNUM", yearNUM) :
                new ObjectParameter("yearNUM", typeof(int));
    
            var custom1_NameParameter = custom1_Name != null ?
                new ObjectParameter("Custom1_Name", custom1_Name) :
                new ObjectParameter("Custom1_Name", typeof(string));
    
            var custom2_NameParameter = custom2_Name != null ?
                new ObjectParameter("Custom2_Name", custom2_Name) :
                new ObjectParameter("Custom2_Name", typeof(string));
    
            var custom3_NameParameter = custom3_Name != null ?
                new ObjectParameter("Custom3_Name", custom3_Name) :
                new ObjectParameter("Custom3_Name", typeof(string));
    
            var custom4_NameParameter = custom4_Name != null ?
                new ObjectParameter("Custom4_Name", custom4_Name) :
                new ObjectParameter("Custom4_Name", typeof(string));
    
            var custom5_NameParameter = custom5_Name != null ?
                new ObjectParameter("Custom5_Name", custom5_Name) :
                new ObjectParameter("Custom5_Name", typeof(string));
    
            var invoiceDateParameter = invoiceDate.HasValue ?
                new ObjectParameter("InvoiceDate", invoiceDate) :
                new ObjectParameter("InvoiceDate", typeof(System.DateTime));
    
            var vATParameter = vAT.HasValue ?
                new ObjectParameter("VAT", vAT) :
                new ObjectParameter("VAT", typeof(int));
    
            var invoiceReferenceNumberParameter = invoiceReferenceNumber != null ?
                new ObjectParameter("InvoiceReferenceNumber", invoiceReferenceNumber) :
                new ObjectParameter("InvoiceReferenceNumber", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertUpdateMonthInvoice", idParameter, monthNUMParameter, yearNUMParameter, custom1_NameParameter, custom2_NameParameter, custom3_NameParameter, custom4_NameParameter, custom5_NameParameter, invoiceDateParameter, vATParameter, invoiceReferenceNumberParameter);
        }
    
        public virtual int InsertUpdateSupplier(Nullable<int> id, string supplierName, string supplierReferenceNumber, string businessAddress, string emailAddress, Nullable<decimal> phoneNumber, Nullable<decimal> companyRegisterNumber, Nullable<decimal> vATNumber, string tAXReference, string companyRegisteredAddress, Nullable<bool> isActive, Nullable<int> imageId)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));
    
            var supplierNameParameter = supplierName != null ?
                new ObjectParameter("SupplierName", supplierName) :
                new ObjectParameter("SupplierName", typeof(string));
    
            var supplierReferenceNumberParameter = supplierReferenceNumber != null ?
                new ObjectParameter("SupplierReferenceNumber", supplierReferenceNumber) :
                new ObjectParameter("SupplierReferenceNumber", typeof(string));
    
            var businessAddressParameter = businessAddress != null ?
                new ObjectParameter("BusinessAddress", businessAddress) :
                new ObjectParameter("BusinessAddress", typeof(string));
    
            var emailAddressParameter = emailAddress != null ?
                new ObjectParameter("EmailAddress", emailAddress) :
                new ObjectParameter("EmailAddress", typeof(string));
    
            var phoneNumberParameter = phoneNumber.HasValue ?
                new ObjectParameter("PhoneNumber", phoneNumber) :
                new ObjectParameter("PhoneNumber", typeof(decimal));
    
            var companyRegisterNumberParameter = companyRegisterNumber.HasValue ?
                new ObjectParameter("CompanyRegisterNumber", companyRegisterNumber) :
                new ObjectParameter("CompanyRegisterNumber", typeof(decimal));
    
            var vATNumberParameter = vATNumber.HasValue ?
                new ObjectParameter("VATNumber", vATNumber) :
                new ObjectParameter("VATNumber", typeof(decimal));
    
            var tAXReferenceParameter = tAXReference != null ?
                new ObjectParameter("TAXReference", tAXReference) :
                new ObjectParameter("TAXReference", typeof(string));
    
            var companyRegisteredAddressParameter = companyRegisteredAddress != null ?
                new ObjectParameter("CompanyRegisteredAddress", companyRegisteredAddress) :
                new ObjectParameter("CompanyRegisteredAddress", typeof(string));
    
            var isActiveParameter = isActive.HasValue ?
                new ObjectParameter("isActive", isActive) :
                new ObjectParameter("isActive", typeof(bool));
    
            var imageIdParameter = imageId.HasValue ?
                new ObjectParameter("ImageId", imageId) :
                new ObjectParameter("ImageId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertUpdateSupplier", idParameter, supplierNameParameter, supplierReferenceNumberParameter, businessAddressParameter, emailAddressParameter, phoneNumberParameter, companyRegisterNumberParameter, vATNumberParameter, tAXReferenceParameter, companyRegisteredAddressParameter, isActiveParameter, imageIdParameter);
        }
    
        public virtual int PatchActiveSupplier(Nullable<int> id, Nullable<bool> isActive)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));
    
            var isActiveParameter = isActive.HasValue ?
                new ObjectParameter("isActive", isActive) :
                new ObjectParameter("isActive", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("PatchActiveSupplier", idParameter, isActiveParameter);
        }
    
        public virtual int DeleteSupplier(Nullable<int> id, Nullable<int> count)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));
    
            var countParameter = count.HasValue ?
                new ObjectParameter("count", count) :
                new ObjectParameter("count", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("DeleteSupplier", idParameter, countParameter);
        }
    
        public virtual ObjectResult<Nullable<int>> InsertUpdateImage(Nullable<int> id, string url)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));
    
            var urlParameter = url != null ?
                new ObjectParameter("url", url) :
                new ObjectParameter("url", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Nullable<int>>("InsertUpdateImage", idParameter, urlParameter);
        }
    }
}

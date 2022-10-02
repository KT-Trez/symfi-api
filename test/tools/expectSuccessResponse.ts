export default function expectSuccessResponse(res: any, status: number, hasID?: boolean) {
	res.should.have.status(status);
	res.body.should.be.a('object');
	res.body.should.have.property('success').eq.true;

	if (hasID)
		res.body.should.have.property('id');
};